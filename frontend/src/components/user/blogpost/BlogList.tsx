import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogs, deleteBlog } from "@/store/slices/blogSlice";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

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

  const fallbackThumbnail = "https://tse1.mm.bing.net/th?id=OIP.kkJ4tBMv2tT9OqxmUWlQFgHaEK&pid=Api&P=0&h=180";

  if (loading) return <p className="text-center text-muted-foreground">Loading blogs...</p>;
  if (error) return <p className="text-destructive text-center">Error: {error}</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Blogs</h1>
        <Button
          onClick={() => navigate("/blog/create")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create New Blog
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length === 0 ? (
          <p className="text-muted-foreground text-center col-span-full">No blogs posted yet.</p>
        ) : (
          blogs.map((blog) => (
            <Card
              key={blog._id}
              className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-card overflow-hidden"
            >
              <img
                src={blog.thumbnail?.url || fallbackThumbnail}
                alt={blog.title || "Blog Thumbnail"}
                className="w-full h-40 object-cover"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-foreground line-clamp-2">
                  {blog.title || "Untitled Blog"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  By {blog.authorName || "Unknown Author"} |{" "}
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Date Unknown"}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags && blog.tags.length > 0 ? (
                      blog.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No Tags
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>ID: {blog._id || "N/A"}</p>
                    <p>Likes: {blog.likes}</p>
                    <p>Comments: {blog.comments}</p>
                    <p>
                      Updated: {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`edit/${blog._id}`)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Edit Blog"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(blog._id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete Blog"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`view/${blog._id}`)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="View Blog"
                  >
                    <Eye className="h-4 w-4" />
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