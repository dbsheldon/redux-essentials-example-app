import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import notificationsReducer, {
  NotificationsState,
} from '../features/notifications/notificationsSlice';
import postsReducer, { PostsState } from '../features/posts/postsSlice';
import usersReducer, { UsersState } from '../features/users/usersSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});

export interface RootState {
  posts: PostsState;
  users: UsersState;
  notifications: NotificationsState;
}

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
