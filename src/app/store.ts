import { configureStore } from '@reduxjs/toolkit';
import postsReducer, { Post } from '../features/posts/postsSlice';
import usersReducer, { User } from '../features/users/usersSlice';

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});

export interface RootState {
  posts: Post[];
  users: User[];
}
