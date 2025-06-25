import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  authorId: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreatePostDto {
  title: string;
  body: string;
}

export interface UpdatePostDto {
  title?: string;
  body?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

class ApiService {
  private api;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Posts API
  async getPosts(page: number = 1, limit: number = 10): Promise<PostsResponse> {
    const response = await this.api.get<PostsResponse>(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getPost(id: number): Promise<Post> {
    const response = await this.api.get<Post>(`/posts/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await this.api.post<Post>('/posts', data);
    return response.data;
  }

  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    const response = await this.api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: number): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
