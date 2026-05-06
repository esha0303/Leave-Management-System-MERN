import dotenv from 'dotenv';
dotenv.config();// Ye line .env file se variables load karti hai
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import  {CloudinaryStorage}  from 'multer-storage-cloudinary';
//connection set up same as env file name
   cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    });
// 2. Storage ki setting (Jaise Folder ka naam aur format)
    const storage= new CloudinaryStorage({

        cloudinary:cloudinary,
        params:{
            folder: 'employee_profiles', // Cloudinary mein is naam ka folder ban jayega
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }] // Photo auto-resize ho jayegi
        }
    })
    // Multer, tum taiyar ho jao, aur jo bhi file tumhare paas aaye, usey seedha Cloudinary par phek dena.

export const upload = multer({ storage: storage });
export { cloudinary };