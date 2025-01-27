import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
export const varifyToken = async (req, res, next) => {
  try {
    console.log("loginig the cookies", req.cookies);
    const token = req.cookies.AuthToken;
    console.log({ token });
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: " bkl tu authenticated hai" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error.message);
  }
};
