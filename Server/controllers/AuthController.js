import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import fs, { renameSync } from "fs";
import path from "path";

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
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(StatusCodes.OK).json({
      message: "user login sucesssfully",
      user: {
        userName: user.userName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error login main hai", error });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found i am in the get userdata" });
    }

    res.status(StatusCodes.OK).json({
      message: "User found sucessfully",
      user: {
        userName: user.userName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("geting update user ");
    const userId = req.userId;
    const { userName, lastName } = req.body;
    if (!userName || !lastName) {
      return res
        .status(404)
        .json({ message: "firstname and the lstname is required" });
    }
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
      image: req.body.image ? req.body.image : user.image,
      profileSetup: true,
    };
    const updatedUser = await User.findByIdAndUpdate(userId, upDateduser, {
      new: true,
      runValidators: true,
    });

    {
      res.status(StatusCodes.OK).json({
        message: "Everything is fine",
        user: {
          userName: updatedUser.userName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          image: updatedUser.image,
          color: updatedUser.color,
          profileSetup: true,
        },
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while updating the profile." });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file is required" });
    }
    const file = req.file;
    const uploaddir = path.join("uploads");
    const fileName = Date.now() + file.originalname;
    const unique = path.join(uploaddir, fileName);
    const filePathForDB = unique.replace(/\\+/g, "/");
    renameSync(file.path, filePathForDB);
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(
      userId,
      { image: filePathForDB },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ image: user.image });
  } catch (error) {
    console.log("pakda gaya bkl!!", error);
    res.status(500).json({ error, message: "Error in image uploading" });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user || !user.image) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Image not found" });
    }
    const imagepath = user.image;
    if (imagepath) {
      fs.unlinkSync(imagepath);
    }

    user.image = null;
    user.save();
    res.status(StatusCodes.OK).json({ message: "image  is removed" });
  } catch (error) {
    console.log("Error while removing image:", error);
    res.status(500).json({ error, message: "Error in removing image" });
  }
};

export const logOutUser = async (req, res) => {
  try {
    console.log("i am in logout");
    res.clearCookie("AuthToken", {
      secure: process.env.NODE_ENV == "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });
    return res.status(200).json({ message: "jashn manao aap logout ho gaye" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "bkl tere se logout nahi ho raha" });
  }
};

export default { signUp, signIn };
