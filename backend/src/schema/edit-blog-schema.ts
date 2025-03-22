import { z } from "zod";
import { createBlogSchema } from "./create-blog.schema";

export const editBlogSchema = createBlogSchema.partial();

export type EditBlogRequestType = z.infer<typeof editBlogSchema>;
