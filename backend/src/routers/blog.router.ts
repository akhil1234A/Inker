import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { BlogRepository } from "@/repositories/implementation/blog.repository";
import { BlogService } from "@/services/implementation/blog.service";
import { BlogController } from "@/controllers/implementation/blog.controller";
import { UserRepository } from "@/repositories/implementation/user.repository";
import { createBlogSchema, editBlogSchema } from "@/schema";
import authenticate from "@/middlewares/verify-token.middleware";

const router = Router();

const blogRepository = new BlogRepository();
const userRepository = new UserRepository();
const blogService = new BlogService(blogRepository, userRepository);
const blogController = new BlogController(blogService);

router.post(
  "/",
  validate(createBlogSchema),
  authenticate("user"),
  blogController.createBlog.bind(blogController)
);

router.get(
  "/",
  authenticate("user"),
  blogController.getAllBlogs.bind(blogController)
);

router.get(
  "/:id",
  authenticate("user"),
  blogController.getBlogById.bind(blogController)
);

router.put(
  "/:id",
  validate(editBlogSchema),
  authenticate("user"),
  blogController.updateBlog.bind(blogController)
);

router.delete(
  "/:id",
  authenticate("user"),
  blogController.deleteBlog.bind(blogController)
);

export default router;
