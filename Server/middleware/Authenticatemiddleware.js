import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";
export const varifyToken = async (request, res, next) => {
  try {
    console.log("loginig the cookies", request.cookies);
    const token = request.cookies.AuthToken;
    console.log({ token });
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: " bkl tu authenticated hai" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("decoded part", decoded);
    request.userId = decoded.userId;
  } catch (error) {
    console.error(error.message);
  }
};
