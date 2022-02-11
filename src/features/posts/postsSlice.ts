import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { client } from '../../api/client';
import { RootState } from '../../app/store';
import { ApiStatus } from '../../types';

interface Reactions {
  [index: string]: number;
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  reactions: Reactions;
}

export interface PostsState {
  posts: Post[];
  apiStatus: {
    fetchPosts: ApiStatus;
    addNewPost: ApiStatus;
  };

  error: {
    fetchPosts?: string;
    addNewPost?: string;
  };
}

interface PostUpdate {
  id: string;
  title: string;
  content: string;
}

interface PostAdd {
  title: string;
  content: string;
  user: string;
}

const initialState: PostsState = {
  posts: [
    {
      id: '1',
      title: 'First Post!',
      content: 'Hello!',
      user: '0',
      date: sub(new Date(), { minutes: 10 }).toISOString(),
      reactions: { thumbsUp: 10, hooray: 0, heart: 0, rocket: 0, eyes: 7 },
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'More text',
      user: '1',
      date: sub(new Date(), { minutes: 5 }).toISOString(),
      reactions: { thumbsUp: 0, hooray: 0, heart: 10, rocket: 5, eyes: 0 },
    },
  ],
  apiStatus: {
    fetchPosts: 'idle',
    addNewPost: 'idle',
  },
  error: {
    fetchPosts: undefined,
    addNewPost: undefined,
  },
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (): Promise<Post[]> => {
    const response = await client.get('fakeApi/posts');
    return response.data;
  }
);

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost: PostAdd) => {
    const response = await client.post('fakeApi/posts', initialPost);
    return response.data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
          },
        };
      },
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { id, title, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction }: { postId: string; reaction: string } =
        action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.apiStatus.fetchPosts = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.apiStatus.fetchPosts = 'succeeded';
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.apiStatus.fetchPosts = 'failed';
        state.error.fetchPosts = action.error.message;
      })
      .addCase(addNewPost.pending, (state, action) => {
        state.apiStatus.addNewPost = 'loading';
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.apiStatus.addNewPost = 'succeeded';
        state.posts.push(action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.apiStatus.addNewPost = 'failed';
        state.error.addNewPost = action.error.message;
      });
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = (state: RootState): Post[] => state.posts.posts;
export const selectPostById = (
  state: RootState,
  postId: string
): Post | undefined => state.posts.posts.find((post) => post.id === postId);
