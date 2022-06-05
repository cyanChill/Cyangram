import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a userId."],
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a followerId."],
  },
});

export default mongoose.models.Follow || mongoose.model("Follow", FollowSchema);
