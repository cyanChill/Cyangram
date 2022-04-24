import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a postId."],
  },
  liker: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a liker userId."],
  },
});

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
