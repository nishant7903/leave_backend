import asyncHandler from 'express-async-handler';
import Leave from '../models/Leave.js';

// @desc    Apply for a new leave
// @route   POST /api/leaves/apply
// @access  Private (Employee only)
const applyLeave = asyncHandler(async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const leave = await Leave.create({
        employeeId: req.user._id,
        leaveType,
        startDate,
        endDate,
        reason,
        status: 'Pending',
    });

    res.status(201).json(leave);
});

// @desc    View my leaves
// @route   GET /api/leaves/my-leaves
// @access  Private (Employee only)
const getMyLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
});

// @desc    View all leaves
// @route   GET /api/leaves/all
// @access  Private (Employer only)
const getAllLeaves = asyncHandler(async (req, res) => {
    // Populate employee details (firstName, lastName, email)
    const leaves = await Leave.find()
        .populate('employeeId', 'firstName lastName email')
        .sort({ createdAt: -1 });

    res.status(200).json(leaves);
});

// @desc    Update leave status
// @route   PATCH /api/leaves/:id/status
// @access  Private (Employer only)
const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const leaveId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status. Status must be Approved or Rejected');
    }

    const leave = await Leave.findById(leaveId);

    if (!leave) {
        res.status(404);
        throw new Error('Leave request not found');
    }

    leave.status = status;
    await leave.save();

    res.status(200).json(leave);
});

// @desc    Get leave dashboard analytics
// @route   GET /api/leaves/dashboard
// @access  Private (Employer only)
const getLeaveDashboard = asyncHandler(async (req, res) => {
    // Analytics to gather:
    // 1. Total leaves
    // 2. Counts by Status (Pending, Approved, Rejected)
    // 3. Counts by Leave Type
    // 4. Recent pending leaves

    const totalLeaves = await Leave.countDocuments();
    
    // Aggregate counts by status
    const statusCounts = await Leave.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Aggregate counts by leave type
    const typeCounts = await Leave.aggregate([
        { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);

    // Get 5 most recent pending leaves requiring attention
    const recentPending = await Leave.find({ status: 'Pending' })
        .populate('employeeId', 'firstName lastName email empId')
        .sort({ createdAt: -1 })
        .limit(5);

    // Format the aggregates into simple objects
    const formattedStatusCounts = {
        Pending: 0,
        Approved: 0,
        Rejected: 0
    };
    statusCounts.forEach(item => {
        formattedStatusCounts[item._id] = item.count;
    });

    const formattedTypeCounts = {};
    typeCounts.forEach(item => {
        formattedTypeCounts[item._id] = item.count;
    });

    res.status(200).json({
        totalLeaves,
        statusCounts: formattedStatusCounts,
        leaveTypeCounts: formattedTypeCounts,
        recentPendingLeaves: recentPending
    });
});

export {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    getLeaveDashboard,
};
