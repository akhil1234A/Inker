import React from "react";
import { Editor } from "./Editor";
import { Card } from "@/components/ui/card";

export default function CreateBlog() {
  return (
    <div className="flex justify-center p-8 min-h-screen">
      <Card className="w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
        <Editor isEditMode={false} />
      </Card>
    </div>
  );
}