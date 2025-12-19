import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import toast from 'react-hot-toast';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
  };
};