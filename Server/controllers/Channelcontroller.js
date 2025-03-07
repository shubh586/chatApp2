import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import { StatusCodes } from "http-status-codes";
import { response } from "express";


export const getUserChannels=async(request ,response)=>{
    try {
     const admin=await User.findById(request.userId);
     const channels=await Channel.find({
        $or:[{admin:admin},{members:admin}]
     }).sort({updatedAt:-1})
     //console.log('printing the channels',channels);
     response.status(StatusCodes.OK).json({channels});
    } catch (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }
}
export const createChannel=async(request,response,next)=>{

    try{
        
        const {name,members}=request.body;
        console.log(members,name);
        const admin =await User.findById(request.userId);

        if(!admin ){
            return response.status(StatusCodes.NOT_FOUND).json({message:"Admin is required required"});
        }
        // console.log('printing the admin',admin);
        if(!name || !members){
            return response.status(StatusCodes.BAD_REQUEST).json({message:"Name and members are required"});
        }

        const validmembers=await User.find({_id:{$in:members}})
        //console.log('printing the valid members',validmembers);
        if(validmembers.length!==members.length){
            return response.status(StatusCodes.BAD_REQUEST).json({message:"Invalid members"});
        }

        const channel=new Channel({
            name,
            members,
            admin:request.userId
        });
        await channel.save();
        //alternate way to add members
        // const channel=Channel.create({name.memners,admin:request.userId});
        return response.status(StatusCodes.CREATED).json({channel});
    }catch{
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error in the create channel'})
    }
}
