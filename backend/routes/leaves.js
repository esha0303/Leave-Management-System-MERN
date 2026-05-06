//ALL API FOR APPLYING, REJECTING , VIEWING THE LEAVE TICKET{employee and admin both}....
import mongoose from 'mongoose';
import express from 'express';
import Leave from '../models/leave.js';
import { verifyToken } from '../middlewares/authMiddle.js';
    const router= express.Router();
//applying leaves here by employee
    router.post('/apply', async (req,res)=>{
        try{
            const {employeeId, employeeName, startDate, endDate, type, reason }=req.body;
//  Database mein save karne se pehle "days" calculate karo
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);

        const diffTime = Math.abs(eDate - sDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            const newLeave= new Leave({
employeeId, employeeName, startDate, endDate, type,days:diffDays, reason, status:'Pending'

            })
            const saveLeave= await newLeave.save();
            res.status(201).json({message:' Leave applied successfully', data: saveLeave})
        }
        catch(error){
            res.status(401).json({message: "server error", data: error.message})

        }

    } )
    //UPDATING THE LOGIC LIKE AVAILABLE LEAVES- 10 USED LEAVES SO THAT EACH USER CAN SEE HIS INDIVIDUAL LEAVES

    router.get("/stats/:userId",async (req,res)=>{
        try{

            const {userId}= req.params;
            const objectId = new mongoose.Types.ObjectId(userId);
            const calculateLeaves= await Leave.aggregate([
                {$match:{employeeId:objectId}},
                {$group:{
                _id:"$employeeId",
                usedLeaves:{
                    $sum:{

                        $cond:[{$eq:["$status","Approved"]}, "$days", 0]
                    }
                },
                pendingLeaves:{
                    $sum:{
                        $cond:[{$eq:["$status","Pending"]},1,0]
                    }
                }
            
            }                }
            ])
            //if true it will return first element of the array calculateleaves[o]th position 
            const result= calculateLeaves.length>0? calculateLeaves[0]:{usedLeaves:0, pendingLeaves:0};
            res.json({
                totalQuota: 10,
                used: result.usedLeaves || 0, // Ensure it's never undefined
                available: 10 - (result.usedLeaves || 0),
                pending: result.pendingLeaves || 0
            })
        }
        catch(error){
            res.status(500).status({error:error.message});
        }

    })
    // get all the leaves info through history box

    router.get("/my-leaves/:userId",verifyToken, async (req,res)=>{
        try{
                    const {userId}= req.params;
                    const leaves= await Leave.find({employeeId:userId}).sort({createdAt:-1});
                    res.json(leaves);
        }
        catch(error){
            res.status(500).json({message: "error finding details", error:error.message})
        }
    });

    //GET ALL REQUEST FOR ALL EMPLOYEE (ADMIN VIEW)

    router.get("/all-leaves", async(req,res)=>{
        try{
            const allLeaves= await Leave.find().sort({createdAt:-1});
            res.json(allLeaves);
            // res.status(201).json({message: })
        }
        catch(error){
            res.status(500).json({message:"Admin access error", error: error.message})
        }
    })

    
    //FOR UPDATING STATUS THROUGH ADMIN

    router.patch("/status/:id", async(req,res)=>{
        try{
            const {status}=req.body;
            const updateLeave= await Leave.findByIdAndUpdate(
                req.params.id,
                {status: status },
              { returnDocument: 'after' }//This returns the updated document instead of the old one   

            )
        if(!updateLeave) return res.status(404).json({message:" Leave not found "})
            res.json({message: `Leave ${status} successfully` , data: updateLeave})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    })
    

    
        
    

export default router;