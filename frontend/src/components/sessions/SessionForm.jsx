import React, { useState } from 'react';
import Button from '../common/Button';

const SessionForm = ({ book, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    startPage: book.currentPage,
    endPage: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const startPage = parseInt(formData.startPage);
    const endPage = parseInt(formData.endPage);

    if (!formData.startPage) {
      newErrors.startPage = 'Start page is required';
    } else if (startPage < 0) {
      newErrors.startPage = 'Start page must be 0 or greater';
    } else if (startPage > book.totalPages) {
      newErrors.startPage = `Start page cannot exceed ${book.totalPages}`;
    }

    if (!formData.endPage) {
      newErrors.endPage = 'End page is required';
    } else if (endPage <= startPage) {
      newErrors.endPage = 'End page must be greater than start page';
    } else if (endPage > book.totalPages) {
      newErrors.endPage = `End page cannot exceed ${book.totalPages}`;
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
      book: book._id,
      startPage: parseInt(formData.startPage),
      endPage: parseInt(formData.endPage),
      notes: formData.notes.trim(),
      date: formData.date,
    };

    onSubmit(submitData);
  };

  const pagesRead = formData.endPage ? parseInt(formData.endPage) - parseInt(formData.startPage) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-1">{book.title}</h4>
        <p className="text-sm text-gray-600">by {book.author}</p>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          className="input-field"
        />
      </div>

      {/* Start Page */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Page <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="startPage"
          value={formData.startPage}
          onChange={handleChange}
          min="0"
          max={book.totalPages}
          className={`input-field ${errors.startPage ? 'border-red-500' : ''}`}
        />
        {errors.startPage && (
          <p className="mt-1 text-sm text-red-600">{errors.startPage}</p>
        )}
      </div>

      {/* End Page */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Page <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="endPage"
          value={formData.endPage}
          onChange={handleChange}
          min={parseInt(formData.startPage) + 1}
          max={book.totalPages}
          placeholder="Enter ending page"
          className={`input-field ${errors.endPage ? 'border-red-500' : ''}`}
        />
        {errors.endPage && (
          <p className="mt-1 text-sm text-red-600">{errors.endPage}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Great chapter! The plot is getting intense..."
          className="input-field resize-none"
        />
      </div>

      {/* Pages to Read Display */}
      {pagesRead > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <p className="text-sm font-medium text-primary-900">
            Pages to read: <span className="text-lg">{pagesRead}</span>
          </p>
        </div>
      )}

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
          Log Session
        </Button>
      </div>
    </form>
  );
};
export default SessionForm;