import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import { editBlog, getBlogs } from "@/store/slices/blogSlice";
import { Editor } from "./Editor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        navigate("/blog/"); // Redirect if blog not found
      }
    }
  }, [dispatch, blogId, blogs, navigate]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;

  return (
    <div className="flex justify-center p-8 md:p-8 min-h-screen w-full md:w-auto">
      <Card className="w-full md:w-full md:max-w-3xl border-0 md:border rounded-none md:rounded-xl bg-background">
        <div className="px-4 py-2 md:px-6 md:py-4 border-b border-border flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className={
                "relative px-2 py-1 md:px-4 md:py-2 text-sm font-medium transition text-primary after:w-full after:h-[2px] after:bg-primary after:absolute after:bottom-0 after:left-0"
              }
            >
              Edit Post
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full p-2 md:p-6 md:space-y-6">
          <Editor isEditMode={true} />
        </div>
      </Card>
    </div>
  );
}