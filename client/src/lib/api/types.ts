import type { ApiResponse, PaginatedResponse } from '@shared/types';

export type { ApiResponse, PaginatedResponse };

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}
