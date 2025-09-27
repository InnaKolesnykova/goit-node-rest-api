import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db/db.js"; 
import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); 
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
