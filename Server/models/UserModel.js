import mongoose, { model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Please provide the email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [5, "Password must be at least 5 characters long"],
  },
  userName: {
    type: String,
    required: false,
  },

  lastName: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    default: 0,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
};

userSchema.methods.comparePassword = async function (userpassword) {
  try {
    return await bcrypt.compare(userpassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};
const User=mongoose.model("User", userSchema);
export default User;