// Since you told me you know MongoDB, let's define how a "User" looks. We need to distinguish between an Employee and an Admin.

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['employee', 'admin'], 
        default: 'employee' 
    },
    totalLeaves: { type: Number, default: 24 },
    usedLeaves: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);