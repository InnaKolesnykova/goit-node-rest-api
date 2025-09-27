import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionUrl = process.env.MONGO_DB_URI;

const connectDB = async () => {
  if (!connectionUrl) {
    throw new Error("MONGO_DB_URI is not defined in .env");
  }

  try {
    await mongoose.connect(connectionUrl);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
