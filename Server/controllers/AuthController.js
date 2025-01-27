import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

const signUp = async (req, res) => {
  try {
    console.log("in the signup", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.create({ email, password });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created sucessfully", user });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "here is the error", error });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("in the signin ", req.body);
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    const Authtoken = user.createJWT();
    res.cookie("AuthToken", Authtoken, {
      httpOnly: true,
      sercure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "user login sucesssfully", user });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error login main hai", error });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    console.log("geting user profile");
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found i am in the get userdata" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "User found sucessfully", user });
  } catch (error) {
    console.error(error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("geting update user ");
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log(req.body);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }

    const upDateduser = {
      userName: req.body.userName ? req.body.userName : user.userName,
      lastName: req.body.lastName ? req.body.lastName : user.lastName,
      color: req.body.color ? req.body.color : user.color,
      profileSetup: req.body.profileSetup
        ? req.body.profileSetup
        : user.profileSetup,
      image: req.body.image ? req.body.image : user.image,
    };
    const updateduser = await User.findByIdAndUpdate(userId, upDateduser, {
      new: true,
      runValidators: true,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Everything is fine", updatedUser: updateduser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while updating the profile." });
  }
};

export default { signUp, signIn };
