
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import leaveRoutes from "./routes/leaves.js";
import userRoutes from "./routes/userLogin.js";
import adminRoutes from "./routes/admin.js";
// import user from './models/user.js';
// import .config() from 'dotenv';
// require('dotenv').config();
const app = express();

// 1. Middleware

app.use(cors());         // Allows your React app (on port 3000) to talk to this server
app.use(express.json()); // Allows the server to understand JSON sent from React
app.use("/api/leaves",leaveRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin", adminRoutes);
// 2. Database Connection
// We will put the actual URL in a .env file later for security
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/leave-management";


mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 3. Basic Test Route
app.get('/', (req, res) => {
    res.send("Server is running perfectly!");
});

// 4. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});