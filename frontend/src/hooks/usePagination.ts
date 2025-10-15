import { useState, useCallback } from 'react';
import { PaginationMeta } from '../types/pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  pagination: PaginationMeta | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setPagination: (meta: PaginationMeta) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
}

export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const { initialPage = 1, initialLimit = 20 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const goToPage = useCallback((newPage: number) => {
    if (pagination) {
      // Ensure page is within bounds
      const validPage = Math.max(1, Math.min(newPage, pagination.totalPages));
      setPage(validPage);
    } else {
      setPage(newPage);
    }
  }, [pagination]);

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      setPage(prev => prev + 1);
    }
  }, [pagination]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      setPage(prev => Math.max(1, prev - 1));
    }
  }, [pagination]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setPagination(null);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    pagination,
    setPage,
    setLimit,
    setPagination,
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
};

export default usePagination;

