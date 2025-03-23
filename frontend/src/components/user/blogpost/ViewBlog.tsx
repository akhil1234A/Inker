import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/store/slices/blogSlice";

export default function ViewBlog() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogEditor);

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(getBlogs());
    }
  }, [dispatch]);
  console.log(blogId,"blogId")
  const blog = blogs.find((b) => b._id === blogId);
  console.log(blog);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;
  if (!blog) return <p className="text-center">Blog not found</p>;

  return (
    <div className="flex justify-center p-8 min-h-screen">
      <Card className="w-full max-w-3xl p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{blog.title}</CardTitle>
          <p className="text-muted-foreground">By {blog.authorName} on {new Date(blog.createdAt).toLocaleDateString()}</p>
        </CardHeader>
        <CardContent>
          <MDEditor.Markdown source={blog.content} className="bg-background text-foreground" />
          <div className="mt-4">
            <Button onClick={() => navigate(`/blog/edit/${blog._id}`)} variant="outline">
              Edit
            </Button>
            <Button onClick={() => navigate("/blog/")} variant="secondary" className="ml-2">
              Back to Blogs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}