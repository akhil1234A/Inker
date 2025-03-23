export type ViewMode = "editor" | "blogs";
export type TabMode = "write" | "preview";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  tags: string[];
  thumbnail: { type: string; url: string } | null;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogEditorState {
  title: string;
  content: string;
  activeTab: TabMode;
  saved: boolean;
  thumbnail: null | {
    name: string;
    url: string;
  };
  currentBlog: Blog | null;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  attachmentUrls: string[];
  blogs: Blog[];
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  editingBlogId: string | null;
  tags: string[];
}