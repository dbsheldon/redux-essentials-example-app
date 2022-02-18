import { useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../app/store';
import { UserRouterProps } from '../../types';
import { selectPostsByUser } from '../posts/postsSlice';
import { selectUserById } from './usersSlice';

interface Props extends RouteComponentProps<UserRouterProps> {}

function UserPage({ match }: Props) {
  const { userId } = match.params;
  const user = useSelector((state: RootState) => selectUserById(state, userId));
  const postsForUser = useSelector((state: RootState) =>
    selectPostsByUser(state, userId)
  );
  const postTitles = postsForUser.map((post) => {
    return (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    );
  });

  if (!user) {
    return <h2>User not found!</h2>;
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
}

export default UserPage;
