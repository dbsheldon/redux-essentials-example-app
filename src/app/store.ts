import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import postsReducer, { PostsState } from '../features/posts/postsSlice';
import usersReducer, { UsersState } from '../features/users/usersSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});

export interface RootState {
  posts: PostsState;
  users: UsersState;
}

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
