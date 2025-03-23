import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Blog } from "@/types";

export const blogService = {
  createBlogService: async (blogData: { title: string; content: string; tags: string }): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.post<{ status: number; message: string }>("/api/blog", blogData);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Blog creation failed. Please try again.");
      throw new Error(err.response?.data?.error || "Blog creation failed.");
    }
  },

  deleteBlogService: async ({ blogId, authorId }: { blogId: string; authorId: string }): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.delete<{ status: number; message: string }>(`/api/blog/${blogId}`, {
        params: { authorId },
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Blog deletion failed. Please try again.");
      throw new Error(err.response?.data?.error || "Blog deletion failed.");
    }
  },

  editBlogService: async (blogData: { title: string; content: string; tags: string; blogId: string }): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.put<{ status: number; message: string }>(`/api/blog/${blogData.blogId}`, blogData);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Blog update failed. Please try again.");
      throw new Error(err.response?.data?.error || "Blog update failed.");
    }
  },
  getAllBlogsService: async (): Promise<Blog[]> => {
    try {
      const response = await axiosInstance.get<Blog[]>("/api/blog"); 
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Failed to fetch blogs");
      throw new Error(err.response?.data?.error || "Failed to fetch blogs");
    }
  },
};