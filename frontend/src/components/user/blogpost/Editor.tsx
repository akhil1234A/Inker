import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ThumbnailUploader } from "./ThumbnailUploader";
import { setTitle, setContent, addTag, removeTag, saveBlog } from "@/store/slices/blogSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface EditorProps {
  isEditMode: boolean;
}

export const Editor: React.FC<EditorProps> = ({ isEditMode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { title, content, editingBlogId, tags, loading } = useSelector(
    (state: RootState) => state.blogEditor
  );
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      dispatch(addTag(newTag.trim()));
      setNewTag("");
    }
  };

  const handleSave = () => {
    dispatch(saveBlog({ title, content, tags, editingBlogId })).then(() => {
      navigate("/blog/"); // Redirect to blog list
    });
  };

  return (
    <div data-color-mode="dark">
      <ThumbnailUploader />
      <div className="relative">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Post Title*"
          className="pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {250 - title.length}
        </span>
      </div>
      <div className="mt-4">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags (press Enter)"
          className="mb-2"
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button onClick={() => dispatch(removeTag(tag))} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <Card className="border rounded-lg overflow-hidden mt-6">
        <MDEditor
          value={content}
          onChange={(value) => dispatch(setContent(value || ""))}
          preview="edit"
          height={300}
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.quote,
            commands.code,
            commands.codeBlock,
            commands.image,
          ]}
        />
      </Card>
      <div className="flex justify-end mt-4 gap-2">
        <Button onClick={() => navigate("/blog/")} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : (isEditMode ? "Update" : "Save")}
        </Button>
      </div>
    </div>
  );
};