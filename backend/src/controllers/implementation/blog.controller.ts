import { NextFunction, Request, Response } from "express";
import { IBlogController } from "../interface/IBlogController";
import { IBlogService } from "@/services/interface/IBlogService";
import { Types } from "mongoose";
import { HttpStatus } from "@/constants";
import { CreateBlogRequestType } from "@/schema/create-blog.schema";
import { EditBlogRequestType } from "@/schema";


export class BlogController implements IBlogController {
  constructor(private blogService: IBlogService) {}

  async createBlog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, content, tags } = req.body as { title: string; content: string; tags: string[] };
      // const blogData = req.body as CreateBlogRequestType;
      const { id } = JSON.parse(req.headers["x-user-payload"] as string);
      // console.log(id)
      // const createdBlog = await this.blogService.createBlog({
      //   ...blogData,
      //   authorId: id,
      // });
      const createdBlog = await this.blogService.createBlog({
        title,
        content, 
        tags,
        authorId: id || new Types.ObjectId(),
        authorName: "Akhilanwarm",
      });
      res.status(HttpStatus.CREATED).json(createdBlog);
    } catch (error) {
      next(error);
    }
  }

  async getBlogById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const blogId = new Types.ObjectId(req.params.id);
      const blog = await this.blogService.getBlogById(blogId);
      res.status(HttpStatus.OK).json(blog);
    } catch (error) {
      next(error);
    }
  }

  async getAllBlogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const blogs = await this.blogService.getAllBlogs();
      res.status(HttpStatus.OK).json(blogs);
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.params)
      const blogId = new Types.ObjectId(req.params.id);
      // const updateData = req.body as EditBlogRequestType;
      // const updatedBlog = await this.blogService.updateBlog(blogId, updateData);
    const { title, content, tags } = req.body as { title: string; content: string; tags: string[] };
    const updatedBlog = await this.blogService.updateBlog(blogId, {
      title,
      content,
      tags,
    });

      res.status(HttpStatus.OK).json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const blogId = new Types.ObjectId(req.params.id);
      const deletedBlog = await this.blogService.deleteBlog(blogId);

      res.status(HttpStatus.OK).json(deletedBlog);
    } catch (error) {
      next(error);
    }
  }
}
