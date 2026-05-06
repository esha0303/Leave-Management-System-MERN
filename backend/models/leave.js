//This will store every ticket submitted by your colleagues.
import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    employeeName: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, required: true },
    reason: String,
    days:{type:Number},
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const Leave = mongoose.model('Leave', LeaveSchema);

export default Leave;