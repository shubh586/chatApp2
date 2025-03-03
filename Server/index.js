import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import path from "path";
import contackRouter from "./routes/ContactRouter.js";
import messageRouter from "./routes/MessageRoutes.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import setupSocket from "./socket.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use('/uploads/files', express.static('uploads/files'));
const port = process.env.PORT || 5000;
app.use("/api/auth", AuthRoutes);
app.use("/api/search", contackRouter);
app.use("/api/message", messageRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .then(() => {
    const server = app.listen(port, () => {
      console.log("Server is running on port", port);
    });
    setupSocket(server);
  })
  .catch((err) => {
    console.log(err);
  });
