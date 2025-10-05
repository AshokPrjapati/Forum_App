const { Schema, model } = require("mongoose");
require("dotenv").config();

const PostSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  authorID: {
    type: String,
    required: true,
    immutable: true,
  },
  createdAt: {
    type: Number,
    immutable: true,
    default: () => Date.now(),
  },
  updateAt: {
    type: Number,
    default: () => Date.now(),
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

const CommentSchema = Schema({
  message: {
    type: String,
    required: true,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    // required: true,
    immutable: true,
  },
  authorID: {
    type: String,
    // required: true,
    immutable: true,
  },
  createdAt: {
    type: Number,
    required: true,
    immutable: true,
    default: () => Date.now(),
  },

  parent: {
    type: Schema.Types.ObjectId,
    immutable: true,
  },

  parentID: {
    type: String,
    immutable: true,
    default: null,
  },

  child: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],

  edited: {
    type: Boolean,
    default: false,
  },

  likes: [{ type: Schema.Types.ObjectId, ref: "CommentLike", default: [] }],
});

const CommentLikeSchema = Schema({
  commentID: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  authorID: {
    type: String,
    required: true,
    immutable: true,
  },
});

const LikesSchema = Schema({
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
  },
  authorID: {
    type: String,
    required: true,
    immutable: true,
  },
});

PostSchema.methods.removeRecords = async function () {
  try {
    const postID = this._id;

    // First, find all comments for this post
    const comments = await CommentModel.find({ postID: postID });
    const commentIds = comments.map((comment) => comment._id);

    // Delete all comment likes for comments in this post
    if (commentIds.length > 0) {
      await CommentLikeModel.deleteMany({ commentID: { $in: commentIds } });
    }

    // Delete all comments for this post
    await CommentModel.deleteMany({ postID: postID });

    // Delete all post likes
    await LikesModel.deleteMany({ postID: postID });

    // Finally, delete the post itself
    await PostModel.deleteOne({ _id: postID });

    return {
      success: true,
      message: "Post and related records deleted successfully",
    };
  } catch (error) {
    console.log("error: ", error);
  }
};

CommentSchema.methods.removeRecords = async function () {
  try {
    const commentID = this._id;

    // Delete all likes for this comment
    await CommentLikeModel.deleteMany({ commentID: commentID });

    // Delete all child comments (replies)
    await CommentModel.deleteMany({ parentID: commentID });

    // Finally, delete the comment itself
    await CommentModel.findByIdAndDelete(commentID);

    return {
      success: true,
      message: "Comment and related records deleted successfully",
    };
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

const PostModel = model("Post", PostSchema);
const LikesModel = model("Like", LikesSchema);
const CommentModel = model("Comment", CommentSchema);
const CommentLikeModel = model("CommentLike", CommentLikeSchema);
module.exports = { PostModel, CommentModel, LikesModel, CommentLikeModel };
