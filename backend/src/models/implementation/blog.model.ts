import { model, Schema, Document, Types } from "mongoose";
import { IBlog } from "shared/types";

export interface IBlogModel extends Document, Omit<IBlog, "_id" | "authorId"> {
  authorId: Types.ObjectId;
};
const blogSchema = new Schema<IBlogModel>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    authorName: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Blog = model<IBlogModel>("Blog", blogSchema);
export default Blog;
