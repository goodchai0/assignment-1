import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, required: true },
    title: { type: String, required: true },
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
    comments: [
      {
        userId: String,
        text: String,
        createdAt: Date,
      },
    ],
  },

  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
