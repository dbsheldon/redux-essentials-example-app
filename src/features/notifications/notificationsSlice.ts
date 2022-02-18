import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../app/store';

interface Notification {
  id: string;
  date: any;
  message: any;
  user: any;
  read?: boolean;
  isNew?: boolean;
}

export interface NotificationsState extends EntityState<Notification> {}

const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: NotificationsState = notificationsAdapter.getInitialState();

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }): Promise<Notification[]> => {
    const allNotifications = selectAllNotifications(getState() as RootState);
    const [latestNotification] = allNotifications;
    const latestTimestamp = latestNotification ? latestNotification.date : '';
    const response = await client(
      `/fakeApi/notifications?since=${latestTimestamp}`
    );
    return response.data;
  }
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        if (notification) {
          notification.read = true;
        }
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload);
      Object.values(state.entities).forEach((notification) => {
        if (notification) {
          notification.isNew = !notification.read;
        }
      });
    });
  },
});

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors<RootState>((state) => state.notifications);

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;
