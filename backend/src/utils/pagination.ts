import { Request } from 'express';

/**
 * Pagination helper types
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Extract pagination parameters from request query
 * Defaults: page=1, limit=20
 */
export const getPaginationParams = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build paginated response with metadata
 */
export const buildPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Quick paginate function for common use cases
 */
export const paginate = async <T>(
  req: Request,
  queryCallback: (skip: number, take: number) => Promise<T[]>,
  countCallback: () => Promise<number>
): Promise<PaginatedResponse<T>> => {
  const { page, limit, skip } = getPaginationParams(req);

  const [data, totalItems] = await Promise.all([
    queryCallback(skip, limit),
    countCallback(),
  ]);

  return buildPaginatedResponse(data, totalItems, page, limit);
};

