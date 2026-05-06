import mongoose from "mongoose";

const UserLogin=new mongoose.Schema({
    email:{
      type:String,
      required:true  
    },
    password:{
        type:String,
        required:true
    },
    name:{
type:String,
    },
    role:{
        type:String,
        enum:['admin', 'employee'],
        default:'employee'
    },
    profileImg:{
        type:String,
        default:""
    }
})
export default mongoose.model('User', UserLogin);