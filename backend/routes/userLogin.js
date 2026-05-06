import express from 'express';
import User from '../models/login.js';
const router=express.Router();
import {upload} from '../config/cloudinaryConfig.js';
import jwt from "jsonwebtoken";

router.post('/login',async (req,res)=>{

    const {email, password}=req.body;
    try{
     const user=await User.findOne({email:email});
     if(!user)return res.status(404).json({message:"user not found"});
     if(!user.password==password) return res.status(400).json({message:"password is incorrect"});

     //generating token
     const token=jwt.sign({
       userId:user._id,
        role: user.role,
        email:user.email
       },
   "myName123",//secret keys
    {expiresIn:'1d'}
)
       
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:token
            //user.role: Jo user hai, wo aapke Database (MongoDB) se aaya hua ek Object hai. Role us object ke andar chhupa hua ek field hai. Isliye hume batana padta hai ki: "Bhai, user naam ke packet ke andar se role nikal kar lao.
        })
    }
    catch(error){
res.status(400).json("server error")
console.log(error)
    }
})
//IMAGES UPLOAD KRNE K LIYE 

    router.post("/upload-file/:userId",upload.single('profileImg'),async(req,res)=>{

        try{
            const {userId}=req.params;

            const imageUrl = req.file ? req.file.path : null;
            if(!imageUrl){
                return res.status(400).json("need imgage...")
            }
           const updateImg=await User.findByIdAndUpdate(
            userId,
            {profileImg:imageUrl},
            { returnDocument: 'after' }, // ✅ Deprecation warning fix
                {new:true}
           )
           res.json({success:true,url: imageUrl, user: updateImg, message: "upload done"})
        }
catch (error) {
    res.status(500).json({ 

        success: false,
        message: "Backend error", 
        error: error.message || "Something went wrong",
    });
}
})
export default router;