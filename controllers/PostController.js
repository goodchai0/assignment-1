import UserModel from "../Models/UserModel.js";
import PostModel from "../Models/PostModel.js";
import mongoose from "mongoose";

// creating a post

export const createPost = async (req, res) => {
  let newPost = new PostModel(req.body);
  newPost.userId = req.user._id;
  console.log(newPost);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id).lean();
    let number_of_likes = post.likes.length;
    let number_of_comments = post.comments.length;
    res.status(200).json({ ...post, number_of_comments, number_of_likes });
  } catch (error) {
    res.status(500).json(error);
  }
};
//create a comment

export const addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const text = req.body.comment;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            userId,
            text,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (updatedPost) {
      res
        .status(201)
        .json({ commentId: updatedPost.comments.slice(-1)[0]._id });
    } else {
      res.status(404).json("Post not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  console.log(userId);
  try {
    let post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json("Post liked");
    }
    console.log(post);
    res.status(200).json("Post was already liked");
  } catch (error) {
    res.status(500).json(error);
  }
};
// like/dislike a post
export const dislikePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).json("Post disliked");
    }
    res.status(200).json("Post was already disliked");
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts with comments and likes count
export const getTimelinePosts = async (req, res) => {
  try {
    const userId = req.user._id; // Corrected property name (_id)
    const currentUserPosts = await PostModel.find();
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    const allPosts = currentUserPosts.concat(
      ...followingPosts[0].followingPosts
    );

    // Merge the comments and likes counts into the posts
    const postsWithCounts = allPosts.map((post) => {
      return {
        ...post.toObject(),
        commentsCount: post.comments.length,
        likesCount: post.likes.length,
      };
    });

    // Sort the posts by createdAt
    const sortedPosts = postsWithCounts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json(error);
  }
};
