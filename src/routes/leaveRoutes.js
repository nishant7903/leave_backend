import express from 'express';
const router = express.Router();
import {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    getLeaveDashboard,
} from '../controllers/leaveController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { roleCheck } from '../middlewares/roleMiddleware.js';

// Define standard role constants
const EMPLOYEE = 'employee';
const EMPLOYER = 'employer';

// Employee routes
router.post('/apply', protect, roleCheck([EMPLOYEE]), applyLeave);
router.get('/my-leaves', protect, roleCheck([EMPLOYEE]), getMyLeaves);

// Employer routes
router.get('/dashboard', protect, roleCheck([EMPLOYER]), getLeaveDashboard);
router.get('/all', protect, roleCheck([EMPLOYER]), getAllLeaves);
router.patch('/:id/status', protect, roleCheck([EMPLOYER]), updateLeaveStatus);

export default router;
