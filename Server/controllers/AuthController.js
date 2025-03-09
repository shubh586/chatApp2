import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
import fs, { renameSync } from "fs";
import path from "path";
import nodemailer from 'nodemailer';
import { response } from "express";


const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
})

export const varify=async(req,res)=>{

  try {
    const {token}=req.params;
    if(!token){
      return response.status(StatusCodes.BAD_REQUEST).json('token is undefinied');
    }
    const decode=jwt.verify(token, process.env.JWT_KEY);
    const {email,password}=decode;
    const user=await User.findOne({email});
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
    }
    const NewUser = await User.create({ email, password ,isVerified:true});
    const Authtoken = NewUser.createJWT();
    res.cookie("AuthToken", Authtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    
    return res.redirect(`${process.env.ORIGIN}/verify-success?status=success`);
  } catch (error) {
    return res.redirect(`${process.env.ORIGIN}/verify-error?status=failed`);
  }
}


const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    if(!email.endsWith('@gmail.com')){
      return response.status(StatusCodes.BAD_REQUEST).json('only gmail accounts are required');
    }
    const existing=await User.findOne({email})
    if(existing){
      return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email is already in use" });
    }
   
    const token = await jwt.sign({email,password},process.env.JWT_KEY,{expiresIn:'1h'})
    const verificationLink = `http://localhost:4589/api/auth/verify/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "here is the error in signup", error });
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
        id: user._id,
        userName: user.userName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
        isVerified:user.isVerified
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
        id: user._id,
        userName: user.userName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
        isVerified:user.isVerified
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
 
    const userId = req.userId;
    const { userName, lastName } = req.body;
    if (!userName || !lastName) {
      return res
        .status(404)
        .json({ message: "firstname and the lstname is required" });
    }
    const user = await User.findById(userId);
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
      isVerified:user.isVerified
    };
    const updatedUser = await User.findByIdAndUpdate(userId, upDateduser, {
      new: true,
      runValidators: true,
    });

    {
      res.status(StatusCodes.OK).json({
        message: "Everything is fine",
        user: {
          id: upDateduser._id,
          userName: updatedUser.userName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          image: updatedUser.image,
          color: updatedUser.color,
          profileSetup: true,
          isVerified:updatedUser.isVerified
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
    console.log("pakda gaya in addProfileImage", error);
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
    return res.status(500).json({ message: "tere se logout nahi ho raha" });
  }
};

export default { signUp, signIn };
