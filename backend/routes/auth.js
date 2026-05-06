import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user'
const router=express.Router();    


router.post('/login', async(req,res)=>{

    const {email, password}=req.body;
  try{
    const users=await user.findOne({email});
    if(!users) return res.status(400).json({msg: "email not found"});

    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg: "invalid credentials"});
    const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "secret", 
            { expiresIn: '1d' }
        );

        res.json({ token, user: { name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}   
  
)
export default router;