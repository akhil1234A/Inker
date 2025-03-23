import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { ViewMode, TabMode, BlogEditorState, Blog } from '@/types/index';
import { blogService } from "@/services/blogServices";

const initialState: BlogEditorState = {
  title: "",
  content: "",
  activeTab: "write",
  saved: false,
  thumbnail: null,
  attachments: [],
  attachmentUrls: [],
  blogs: [],
  viewMode: "editor",
  loading: false,
  error: null,
  editingBlogId: null,
  tags: [],
  currentBlog: null,
};

interface SaveBlogPayload {
  title: string;
  content: string;
  tags: string[];
  editingBlogId: string | null;
}

interface DeleteBlogPayload {
  blogId: string;
  authorId: string;
}

// Thunks
export const saveBlog = createAsyncThunk(
  "blogEditor/saveBlog",
  async ({ title, content, tags, editingBlogId }: SaveBlogPayload, { rejectWithValue }) => {
    try {
      const blogData = { 
        title, 
        content, 
        tags: JSON.stringify(tags) // Convert array to string for API
      };
      if (editingBlogId) {
        await blogService.editBlogService({ ...blogData, blogId: editingBlogId });
      } else {
        await blogService.createBlogService(blogData);
      }
      return { title, content, tags, editingBlogId };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getBlogs = createAsyncThunk(
  "blogEditor/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogService.getAllBlogsService();
      return response; 
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch blogs");
    }
  }
);


export const deleteBlog = createAsyncThunk(
  "blogEditor/deleteBlog",
  async ({ blogId, authorId }: DeleteBlogPayload, { rejectWithValue }) => {
    try {
      await blogService.deleteBlogService({ blogId, authorId });
      return blogId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete blog");
    }
  }
);

export const getBlogById = createAsyncThunk(
  "blogEditor/getBlogById",
  async (blogId: string, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogByIdService(blogId);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch blog");
    }
  }
);

export const blogSlice = createSlice({
  name: "blogEditor",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.saved = false;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.saved = false;
    },
    setActiveTab: (state, action: PayloadAction<TabMode>) => {
      state.activeTab = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.push(action.payload);
      state.saved = true;
      state.viewMode = "blogs";
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
        state.saved = true;
        state.viewMode = "blogs";
      }
    },
    editBlog: (state, action: PayloadAction<Blog>) => {
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.thumbnail = null;
      state.attachments = [];
      state.attachmentUrls = action.payload.attachmentUrls || [];
      state.tags = action.payload.tags;
      state.editingBlogId = action.payload._id;
      state.viewMode = "editor";
      state.saved = true;
    },
    setThumbnail: (state, action: PayloadAction<{ url: string; name: string } | null>) => {
      state.thumbnail = action.payload;
      state.saved = false;
    },
    addAttachment: (state, action: PayloadAction<{ url: string; name: string }>) => {
      state.attachments.push({ url: action.payload.url, name: action.payload.name });
      state.attachmentUrls.push(action.payload.url);
      state.saved = false;
    },
    removeAttachment: (state, action: PayloadAction<number>) => {
      state.attachments.splice(action.payload, 1);
      state.attachmentUrls.splice(action.payload, 1);
      state.saved = false;
    },
    resetEditor: (state) => {
      state.title = "";
      state.content = "";
      state.thumbnail = null;
      state.attachments = [];
      state.attachmentUrls = [];
      state.tags = [];
      state.saved = false;
      state.editingBlogId = null;
    },
    setSaved: (state, action: PayloadAction<boolean>) => {
      state.saved = action.payload;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
        state.saved = false;
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
      state.saved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.saved = true;
        const newBlog: Blog = {
          _id: action.payload.editingBlogId || Date.now().toString(),
          title: action.payload.title,
          content: action.payload.content,
          author: "Current User",
          authorId: "user-1",
          authorName: "Current User",
          tags: action.payload.tags,
          thumbnail: null,
          attachments: [],
          attachmentUrls: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0,
          comments: 0
        };
        if (action.payload.editingBlogId) {
          const index = state.blogs.findIndex(b => b._id === action.payload.editingBlogId);
          if (index !== -1) {
            state.blogs[index] = newBlog;
          }
        } else {
          state.blogs.push(newBlog);
        }
        state.viewMode = "blogs";
      })
      .addCase(saveBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.loading = false;
        state.blogs = action.payload; 
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.currentBlog = action.payload; 
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTitle,
  setContent,
  setActiveTab,
  setViewMode,
  addBlog,
  updateBlog,
  editBlog,
  setThumbnail,
  addAttachment,
  removeAttachment,
  resetEditor,
  setSaved,
  addTag,
  removeTag,
} = blogSlice.actions;

export default blogSlice.reducer;