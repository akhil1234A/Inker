import { BaseRepository } from "../base.repository";
import { IBlogRepository } from "../interface/IBlogRepository";
import Blog, { IBlogModel } from "@/models/implementation/blog.model";
import { Types } from "mongoose";

export class BlogRepository
  extends BaseRepository<IBlogModel>
  implements IBlogRepository
{
  constructor() {
    super(Blog);
  }

  async createBlog(blogData: Partial<IBlogModel>): Promise<IBlogModel> {
    const newBlog = await this.create(blogData);
    return newBlog;
  }

  async findBlogById(blogId: Types.ObjectId): Promise<IBlogModel | null> {
    return this.findById(blogId);
  }

  async findAllBlogs(): Promise<IBlogModel[]> {
    return this.findAll();
  }

  async updateBlog(
    blogId: Types.ObjectId,
    updateData: Partial<IBlogModel>
  ): Promise<IBlogModel | null> {
    return this.update(blogId, updateData);
  }

  async deleteBlog(blogId: Types.ObjectId): Promise<IBlogModel | null> {
    return this.delete(blogId);
  }
}
