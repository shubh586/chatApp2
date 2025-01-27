import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use("/api/auth", AuthRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log("Server is running on port", port);
});
