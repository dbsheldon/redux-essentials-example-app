import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { selectUserById } from '../users/usersSlice';

interface Props {
  userId: string;
}

export const PostAuthor = ({ userId }: Props) => {
  const author = useSelector((state: RootState) =>
    selectUserById(state, userId)
  );

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
