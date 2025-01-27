import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
const signUp = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log(req.body);
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
      sercure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "None",
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

export default { signUp, signIn };
