import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../api/client';

export interface User {
  id: string;
  name: string;
}

export interface UsersState {
  users: User[];
  apiStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: UsersState = {
  users: [
    { id: '0', name: 'Tianna Jenkins' },
    { id: '1', name: 'Kevin Grant' },
    { id: '2', name: 'Madison Price' },
  ],
  apiStatus: 'idle',
  error: undefined,
};

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
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = state.users.concat(action.payload);
    });
  },
});

export default usersSlice.reducer;
