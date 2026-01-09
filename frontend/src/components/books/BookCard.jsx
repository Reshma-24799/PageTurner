import React from 'react';
import { BookOpen, Edit2, Trash2, Star, Flame, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const BookCard = ({ book, onEdit, onDelete, onLogSession }) => {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  const pagesLeft = book.totalPages - book.currentPage;

  // Progress bar color based on percentage
  let progressColor = 'from-red-400 to-green-600';
  if (progress >= 75) progressColor = 'from-green-400 to-green-600';
  else if (progress >= 25) progressColor = 'from-yellow-400 to-yellow-600';

  // Status badge colors
  const statusColors = {
    'Currently Reading': 'bg-green-100 text-green-700',
    'Completed': 'bg-blue-100 text-blue-700',
    'Want to Read': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="shrink-0">
          <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-200">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-8 h-8 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>';
                }}
              />
            ) : (
              <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate transition-colors duration-200">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate transition-colors duration-200">by {book.author}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(book)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit book"
              >
                <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onDelete(book._id)}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete book"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>

          {/* Rating */}
          {book.rating && (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < book.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2 transition-colors duration-200">
              <div
                className={`h-full bg-linear-to-r ${progressColor} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary-600 dark:text-primary-400">{progress}%</span>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {book.currentPage} / {book.totalPages} pages
              </span>
            </div>
          </div>

          {/* Status and Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[book.status]
                }`}
            >
              {book.status}
            </span>

            {book.streakDays > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 transition-colors duration-200">
                <Flame className="w-4 h-4" />
                {book.streakDays}-day streak
              </span>
            )}

            {book.startDate && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <Calendar className="w-3 h-3" />
                Started: {format(new Date(book.startDate), 'MMM dd, yyyy')}
              </span>
            )}
          </div>

          {/* Log Session Button */}
          {book.status !== 'Completed' && (
            <button
              onClick={() => onLogSession(book)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors text-sm font-medium"
            >
              Log Session
            </button>
          )}

          {book.status === 'Completed' && book.completedDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 transition-colors duration-200">
              ✓ Completed on {format(new Date(book.completedDate), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;