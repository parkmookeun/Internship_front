// hooks/useComments.js
import { useState, useEffect } from 'react';
import { fetchComments } from '../util/commentApi';

export const useComments = (postId, pageSize = 10) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadComments = async (page = 1) => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const data = await fetchComments(postId, page, pageSize);
      
      setComments(data.content || data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments(1);
  }, [postId]);

  const handlePageChange = (page) => {
    loadComments(page);
  };

  const refresh = () => {
    loadComments(currentPage);
  };

  return {
    comments,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    handlePageChange,
    refresh
  };
};