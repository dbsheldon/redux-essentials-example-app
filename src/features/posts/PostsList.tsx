import { EntityId } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../app/store';
import { Spinner } from '../../components/Spinner';
import { PostAuthor } from './PostAuthor';
import { fetchPosts, selectPostById, selectPostIds } from './postsSlice';
import { ReactionButtons } from './ReactionButtons';
import { TimeAgo } from './TimeAgo';

const PostExcerpt = ({ postId }: { postId: EntityId }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  if (!post) return <div>Post was not found!</div>;
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  );
};

export function PostsList() {
  const dispatch = useAppDispatch();
  const orderedPostIds = useSelector(selectPostIds);
  const postStatus = useSelector(
    (state: RootState) => state.posts.apiStatus.fetchPosts
  );
  const error = useSelector((state: RootState) => state.posts.error.fetchPosts);

  useEffect(() => {
    if (postStatus === 'idle') dispatch(fetchPosts());
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />;
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>;
  }

  if (postStatus === 'failed') return <h1>{error}</h1>;

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
}
