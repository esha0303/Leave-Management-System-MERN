import express from 'express';
import Leave from '../models/leave.js';

const router=express.Router();

router.get("/all-leaves",async (req,res)=>{

    try{
        const allLeaves= await Leave.find().sort({createdAt:-1})
        console.log(allLeaves);
        res.status(200).json(allLeaves)
    }
    catch(error){
        res.status(500).json("server error");
        
    }
})

router.patch("/update-leaves/:_id", async(req,res)=>{

    try{
        const {status}=req.body;
        const fetchDetails= await Leave.findOneAndUpdate(
            req.params.id,
            {status:status},
            {new: true}
            
            
        );
        console.log((fetchDetails));
        res.status(200).json({message:`Leave ${status} updated successfully`, data:fetchDetails});

    }
    catch(error){
        
        res.status(500).json({message:"there is server error"})
    }
})
export default router;