import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
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

export interface PostsState extends EntityState<Post> {
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

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: PostsState = postsAdapter.getInitialState({
  apiStatus: {
    fetchPosts: 'idle',
    addNewPost: 'idle',
  },
  error: {
    fetchPosts: undefined,
    addNewPost: undefined,
  },
});

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (): Promise<Post[]> => {
    const response = await client.get('fakeApi/posts');
    return response.data;
  }
);

export const addNewPost = createAsyncThunk<Post, PostAdd>(
  'posts/addNewPost',
  async (initialPost) => {
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
        postsAdapter.addOne(state, action);
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
      const existingPost = state.entities[id];
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction }: { postId: string; reaction: string } =
        action.payload;
      const existingPost = state.entities[postId];
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
        postsAdapter.upsertMany(state, action.payload);
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
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.apiStatus.addNewPost = 'failed';
        state.error.addNewPost = action.error.message;
      });
  },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
);
