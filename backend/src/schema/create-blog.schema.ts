import { HttpResponse } from "@/constants/response-message.constant";
import { z } from "zod";

export const createBlogSchema = z
  .object({
    title: z
      .string()
      .min(1, HttpResponse.REQUIRED_TITLE)
      .max(200, "Title must not exceed 200 characters"),
    content: z
      .string()
      .min(1, HttpResponse.REQUIRED_CONTENT)
      .max(5000, "Content must not exceed 5000 characters"),
    thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

export type CreateBlogRequestType = z.infer<typeof createBlogSchema>;
