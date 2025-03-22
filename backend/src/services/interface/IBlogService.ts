// import { IBlogModel } from "@/models/implementation/blog.model";
// import { ICreateBlogRequestDTO } from "shared/types";

// export interface IBlogService {
//   create(data: ICreateBlogRequestDTO): Promise<IBlogModel>;
//   createBlog(blogData: any): Promise<any>;
//   getBlogById(blogId: string): Promise<any>;
//   getAllBlogs(): Promise<any>;
//   updateBlog(blogId: string, updateData: any): Promise<any>;
//   deleteBlog(blogId: string): Promise<any>;
// }

import { Types } from "mongoose";
import { IBlogModel } from "@/models/implementation/blog.model";

export interface IBlogService {
  createBlog(blogData: Partial<IBlogModel>): Promise<IBlogModel>;
  getBlogById(blogId: Types.ObjectId): Promise<IBlogModel>;
  getAllBlogs(): Promise<IBlogModel[]>;
  updateBlog(
    blogId: Types.ObjectId,
    updateData: Partial<IBlogModel>
  ): Promise<IBlogModel>;
  deleteBlog(blogId: Types.ObjectId): Promise<IBlogModel>;
}
