import { useState, useCallback } from 'react';

export const usePagination = (initialPerPage = 20) => {
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: initialPerPage,
  });

  const handlePageChange = useCallback((newPage) => {
    setPagination((prev) => ({
      ...prev,
      current_page: newPage,
    }));
  }, []);

  const handlePerPageChange = useCallback((perPage) => {
    setPagination((prev) => ({
      ...prev,
      per_page: perPage,
      current_page: 1,
    }));
  }, []);

  const updatePaginationTotal = useCallback((totalItems, totalPages) => {
    setPagination((prev) => ({
      ...prev,
      total_items: totalItems,
      total_pages: totalPages,
    }));
  }, []);

  return {
    pagination,
    handlePageChange,
    handlePerPageChange,
    updatePaginationTotal,
  };
};