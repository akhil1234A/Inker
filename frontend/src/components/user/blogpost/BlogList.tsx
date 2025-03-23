import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogs, deleteBlog } from "@/store/slices/blogSlice";
import { useNavigate } from "react-router-dom";

export default function BlogListCards() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogEditor);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleDelete = (blogId: string) => {
    dispatch(deleteBlog({ blogId, authorId: "user-1" })); 
  };

  if (loading) return <p className="text-center">Loading blogs...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">All Blogs</h1>
        <Button onClick={() => navigate("/blog/create")}>Create New Blog</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length === 0 ? (
          <p className="text-muted-foreground text-center col-span-full">No blogs posted yet.</p>
        ) : (
          blogs.map((blog) => (
            <Card key={blog._id} className="border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`edit/${blog._id}`)}
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(blog._id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => navigate(`view/${blog._id}`)}
                    variant="secondary"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}