import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
  ],
});
channelSchema.pre("save",function (next) {
  this.updatedAt = Date.now();
  next();
});
channelSchema.pre("findOneAndUpdate", function (next){
  this.updatedAt = Date.now();
  next();
});
const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
//

// Your channelSchema.pre("save", (next) => {...}) uses this.updatedAt, but arrow functions (=>) do not bind this to the schema instance. 
// Try using a regular function instead: