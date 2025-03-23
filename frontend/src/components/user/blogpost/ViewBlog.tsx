import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogById } from "@/store/slices/blogSlice"; // Import new thunk
import { Pencil, ArrowLeft } from "lucide-react";

export default function ViewBlog() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { currentBlog, loading, error } = useSelector((state: RootState) => state.blogEditor);

  useEffect(() => {
    if (blogId) {
      dispatch(getBlogById(blogId));
    }
  }, [dispatch, blogId]);

  console.log(blogId, "blogId");
  console.log(currentBlog, "currentBlog");

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;
  if (!currentBlog || currentBlog._id !== blogId) return <p className="text-center">Blog not found</p>;

  return (
    <div className="flex justify-center p-8 min-h-screen">
      <Card className="w-full max-w-3xl border rounded-xl bg-background">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/blog/")}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Back to Blogs"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-3xl font-bold text-foreground">{currentBlog.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/blog/edit/${currentBlog._id}`)}
            className="text-muted-foreground hover:text-primary"
            aria-label="Edit Blog"
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-invert max-w-none text-foreground">
            <MDEditor.Markdown
              source={currentBlog.content}
              className="bg-transparent text-foreground"
              style={{ background: "transparent", color: "inherit" }}
            />
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            By {currentBlog.authorName} on {new Date(currentBlog.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}