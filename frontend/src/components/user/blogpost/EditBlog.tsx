import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import { editBlog, getBlogs } from "@/store/slices/blogSlice";
import { Editor } from "./Editor";
import { Card } from "@/components/ui/card";

export default function EditBlog() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogEditor);

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getBlogs());
    } else {
      const blog = blogs.find((b) => b._id === blogId);
      if (blog) {
        dispatch(editBlog(blog));
      } else {
        // navigate("/blog/"); // Redirect if blog not found
      }
    }
  }, [dispatch, blogId, blogs, navigate]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;

  return (
    <div className="flex justify-center p-8 min-h-screen">
      <Card className="w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
        <Editor isEditMode={true} />
      </Card>
    </div>
  );
}