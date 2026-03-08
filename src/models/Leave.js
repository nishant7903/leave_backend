import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        required: [true, 'Please provide the type of leave'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date'],
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
