import React from 'react';
import BookCard from './BookCard';
import { BookOpen, Plus } from 'lucide-react';
import Button from '../common/Button';

const BookList = ({ books, onEdit, onDelete, onLogSession, onAdd, isSearching }) => {
  if (books.length === 0) {
    if (isSearching) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 transition-colors duration-200">
            <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
            Try adjusting your search terms or filters.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 transition-colors duration-200">
          <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          No books yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
          Start your reading journey by adding your first book!
        </p>
        <Button
          onClick={onAdd}
          icon={Plus}
          variant="primary"
        >
          Add Book
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onLogSession={onLogSession}
        />
      ))}
    </div>
  );
};

export default BookList;