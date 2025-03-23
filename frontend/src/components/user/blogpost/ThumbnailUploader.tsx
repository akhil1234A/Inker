import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThumbnail } from "@/store/slices/blogSlice";
import type { RootState } from "@/store/store";
import { Camera, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";

export const ThumbnailUploader: React.FC = () => {
  const dispatch = useDispatch();
  const thumbnail = useSelector((state: RootState) => state.blogEditor.thumbnail);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (thumbnail) {
      setThumbnailUrl(thumbnail.url);
    } else {
      setThumbnailUrl(null);
    }
  }, [thumbnail]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch(setThumbnail({ name: file.name, url }));
    }
  }, [dispatch]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setThumbnail(null));
  }, [dispatch]);

  return (
    <Card
      className="relative flex items-center justify-center cursor-pointer border border-dashed p-4 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md"
      onClick={() => document.getElementById("thumbnail-upload")?.click()}
    >
      {thumbnailUrl ? (
        <>
          <AspectRatio ratio={16 / 9} className="w-full max-w-xs">
            <img
              src={thumbnailUrl}
              alt="Thumbnail preview"
              className="rounded-md object-cover w-full h-full border border-border"
            />
          </AspectRatio>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Camera className="w-8 h-8 text-muted-foreground" />
          <Label className="text-sm font-medium text-muted-foreground">Add Thumbnail</Label>
        </div>
      )}
      <Input
        type="file"
        id="thumbnail-upload"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </Card>
  );
};