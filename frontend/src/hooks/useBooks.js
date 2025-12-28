import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import toast from 'react-hot-toast';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    hasMore: true,
    total: 0
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);

      const response = await bookService.getBooks({ page, limit: pagination.limit });
      const { data, pagination: paginationData } = response;

      if (page === 1) {
        setBooks(data);
      } else {
        setBooks(prev => [...prev, ...data]);
      }

      setPagination(prev => ({
        ...prev,
        page,
        total: paginationData.total,
        hasMore: page < paginationData.pages
      }));

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchBooks(pagination.page + 1);
    }
  };

  const addBook = async (bookData) => {
    try {
      const newBook = await bookService.createBook(bookData);
      setBooks([...books, newBook]);
      toast.success('Book added successfully!');
      return newBook;
    } catch (error) {
      throw error;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      setBooks(books.map(book => book._id === id ? updatedBook : book));
      toast.success('Book updated successfully!');
      return updatedBook;
    } catch (error) {
      throw error;
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      setBooks(books.filter(book => book._id !== id));
      toast.success('Book deleted successfully!');
    } catch (error) {
      throw error;
    }
  };

  return {
    books,
    loading,
    error,
    fetchBooks: () => fetchBooks(1),
    addBook,
    updateBook,
    deleteBook,
    pagination,
    loadMore,
  };
};