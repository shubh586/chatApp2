import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.query;
    // console.log(request);
    if (!searchTerm) {
      return response.status(400).send("searchTerm is required.");
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });
    // console.log(contacts);
    return response.status(StatusCodes.OK).json({ contact: contacts || [] });
  } catch (error) {
    console.log(error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
};
