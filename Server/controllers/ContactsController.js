import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
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

export const getContacts = async (request, response, next) => {
  const user1 = request.userId;

  try {
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(user1) },
            { recipient: new mongoose.Types.ObjectId(user1) },
          ],
        },
      },

      { $sort: { timestamp: -1 } },

      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", new mongoose.Types.ObjectId(user1)] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: "$contactInfo._id",
          userName: "$contactInfo.userName",
          lastName: "$contactInfo.lastName",
          email: "$contactInfo.email",
          color: "$contactInfo.color",
          image: "$contactInfo.image",
          profileSetup: "$contactInfo.profileSetup",
          lastMessageTime: 1,
        },
      },

      { $sort: { lastMessageTime: -1 } },
    ]);

    return response.status(StatusCodes.OK).json({ contacts: contacts || [] });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
      const users = await User.find(
          { _id: { $ne: request.userId } },
          "firstName lastName _id email"
      );

      const contacts = users.map((user) => ({
          label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
          value: user._id,
      }));

      return response.status(200).json({ contacts });
  } catch (error) {
      console.log( error );
      return response.status(500).send("Internal Server Error");
  }
};
