// Middleware ek "Security Guard" hai. Ye request ko destination (Route) tak pahunchne se pehle beech mein rok kar check karta hai ki user ke paas valid "Entry Pass" (Token) hai ya nahi.

import jwt from "jsonwebtoken";

export const verifyToken=((req,res, next)=>{
// 1. Header se token nikalo
    // Frontend se token 'Bearer <token>' format mein aata hai
    const authHeader=req.headers['authorization']
    const token= authHeader &&authHeader.split(' ')[1]

    if(!token) return res.status(401).json("token not found");
    //generated token ko verrify kro fronetnd se
    try{
        const verified=jwt.verify(token, "myName123")
        req.user=verified
        //next function ko chlne ka mauka do
        next()
    }
    catch(error){
        res.status(400).json({message:"token expired or invalid token"});
        console.log(error)
    }
})