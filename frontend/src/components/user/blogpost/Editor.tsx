import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ThumbnailUploader } from "./ThumbnailUploader";

import { 
  setTitle, 
  setContent, 
  addTag,
  removeTag,
  saveBlog
} from "@/store/slices/blogSlice";
import type { RootState } from "@/store/store";
import { AppDispatch } from "@/store/store";

export const Editor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { title, content, editingBlogId, tags, loading } = useSelector(
    (state: RootState) => state.blogEditor
  );
  const [newTag, setNewTag] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      dispatch(addTag(newTag.trim()));
      setNewTag("");
    }
  };

  const handleSave = () => {
    dispatch(saveBlog({
      title,
      content,
      tags,
      editingBlogId
    }));
  };

  // const imageCommand = {
  //   name: 'image',
  //   keyCommand: 'image',
  //   buttonProps: { 'aria-label': 'Insert image' },
  //   icon: <svg width="12" height="12" viewBox="0 0 20 20"><path fill="currentColor" d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"/></svg>,
  //   execute: (state: { selectedText: string }, api: { replaceSelection: (text: string) => void }) => {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.accept = 'image/*';
  //     input.onchange = async (e) => {
  //       const file = (e.target as HTMLInputElement).files?.[0];
  //       if (file) {
  //         const url = URL.createObjectURL(file);
  //         dispatch(addAttachment({ file, url }));
  //         const imageMarkdown = `![${file.name}](${url})`;
  //         api.replaceSelection(imageMarkdown);
  //       }
  //     };
  //     input.click();
  //   },
  // };

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
              <button
                onClick={() => dispatch(removeTag(tag))}
                className="ml-1 hover:text-destructive"
              >
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
            // imageCommand
          ]}
        />
       
      </Card>
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className=""
        >
          {loading ? "Saving..." : (editingBlogId ? "Update" : "Save")}
        </Button>
      </div>
    </div>
  );
};