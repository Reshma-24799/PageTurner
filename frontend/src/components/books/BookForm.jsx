import React, { useState, useEffect } from 'react';
import { X, Loader2, Star } from 'lucide-react';
import Button from '../common/Button';

const BookForm = ({ book, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    status: 'Want to Read',
    coverUrl: '',
    rating: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        totalPages: book.totalPages || '',
        status: book.status || 'Want to Read',
        coverUrl: book.coverUrl || '',
        rating: book.rating || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.totalPages) {
      newErrors.totalPages = 'Total pages is required';
    } else if (formData.totalPages < 1) {
      newErrors.totalPages = 'Total pages must be at least 1';
    }

    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      ...formData,
      totalPages: parseInt(formData.totalPages),
      rating: formData.rating ? parseInt(formData.rating) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
          className={`input-field ${errors.author ? 'border-red-500' : ''}`}
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author}</p>
        )}
      </div>

      {/* Total Pages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Pages <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="totalPages"
          value={formData.totalPages}
          onChange={handleChange}
          placeholder="e.g., 350"
          min="1"
          className={`input-field ${errors.totalPages ? 'border-red-500' : ''}`}
        />
        {errors.totalPages && (
          <p className="mt-1 text-sm text-red-600">{errors.totalPages}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field"
        >
          <option value="Want to Read">Want to Read</option>
          <option value="Currently Reading">Currently Reading</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${formData.rating >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                  }`}
              />
            </button>
          ))}
          {formData.rating && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: '' }))}
              className="ml-2 text-xs text-gray-400 hover:text-red-500"
            >
              Clear
            </button>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Cover URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover URL (optional)
        </label>
        <input
          type="url"
          name="coverUrl"
          value={formData.coverUrl}
          onChange={handleChange}
          placeholder="https://example.com/cover.jpg"
          className="input-field"
        />
        <p className="mt-1 text-xs text-gray-500">
          Paste a direct link to the book cover image
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          loading={loading}
        >
          {book ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;