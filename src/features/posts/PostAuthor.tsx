import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { User } from '../users/usersSlice';

interface Props {
  userId: string;
}

export const PostAuthor = ({ userId }: Props) => {
  const author = useSelector<RootState, User | undefined>((state) =>
    state.users.users.find((user) => user.id === userId)
  );

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
