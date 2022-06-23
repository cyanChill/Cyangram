import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a recieverId."],
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a senderId."],
  },
  messageContent: {
    type: String,
    maxlength: [200, "Message can't be more than 200 characters."],
  },
  date: { type: Number, required: [true, "Please provide a date (in ms)."] },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
