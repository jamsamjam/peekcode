import dotenv from "dotenv";
import app from "./app.ts";
import connectDB from "./config/database.js";

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("MongoDB connection failed", error);
        
    }
}

startServer();