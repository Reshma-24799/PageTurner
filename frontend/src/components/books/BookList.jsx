import React from 'react';
import BookCard from './BookCard';
import { BookOpen, Plus } from 'lucide-react';

const BookList = ({ books, onEdit, onDelete, onLogSession, onAdd }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No books yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start your reading journey by adding your first book!
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </button>
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