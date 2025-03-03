
import Message from "../models/MessageModel.js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import fs, { renameSync } from "fs";
import path from "path";
import { console } from "inspector";
dotenv.config();

export const getMessages = async (request, response) => {
    console.log('mere tak request aa rahi hai');
    try{
       
        const user1= request.userId;
        const user2= request.body.id;
        if(!user1 || !user2){
            return response.status(StatusCodes.BAD_REQUEST).json({message: "Invalid request"});
        }
        const messages=await Message.find({
            $or:[{sender:user1,recipient:user2},{sender:user2,recipient:user1}]
        }).sort({timestamp:1});
        return response.status(StatusCodes.OK).json({messages});
    }
    catch{
        console.log(error);
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Server error"});
    }
}
export const sendFiles = async (request, response) => {
    try {
        const file= request.file;
        if(!file){
            return response.status(StatusCodes.BAD_REQUEST).json({message: "Please provide file"});
        }

        const uploaddir=path.join("uploads","files");
        if (!fs.existsSync(uploaddir)) {
            fs.mkdirSync(uploaddir, { recursive: true }); // Create 'uploads/files' directory if it doesn't exist
            //  bcoz doest create the directory automatically
          }
        const fileName=Date.now()+file.originalname;
        const filePath=path.join(uploaddir,fileName);
        // Move the uploaded file to the correct directory
        fs.renameSync(file.path, filePath);
        response.status(StatusCodes.OK).json({
            message: "File uploaded successfully",
            fileName: fileName,
            filePath: filePath
        });



    } catch (error) {
        
    }
}



