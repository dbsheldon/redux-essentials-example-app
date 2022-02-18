import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../app/store';

export interface User {
  id: string;
  name: string;
}

export interface UsersState extends EntityState<User> {
  apiStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const usersAdapter = createEntityAdapter<User>();
const initialState: UsersState = usersAdapter.getInitialState({
  apiStatus: 'idle',
  error: undefined,
});

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (): Promise<User[]> => {
    const response = await client.get('fakeApi/users');
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
  },
});

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>((state) => state.users);

export default usersSlice.reducer;
