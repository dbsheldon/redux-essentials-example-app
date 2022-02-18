export interface PostRouterProps {
  postId: string;
}

export interface UserRouterProps {
  userId: string;
}

export type ApiStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
