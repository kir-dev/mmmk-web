export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  authorId: string;
}

export interface PaginatedPosts {
  data: Post[];
  count: number;
  page: number;
  limit: number;
}
