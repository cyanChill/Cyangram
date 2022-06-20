import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a userId."],
  },
  description: {
    type: String,
    maxlength: [200, "Descriptions can't be more than 200 characters."],
  },
  image: {
    url: { type: String, required: [true, "Please provide a img url."] },
    identifier: {
      type: String,
      required: [true, "Please provide an img identifier in Firebase."],
    },
  },
  date: { type: Number, required: [true, "Please provide a date (in ms)."] },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
