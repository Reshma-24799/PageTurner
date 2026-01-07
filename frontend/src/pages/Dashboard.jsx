import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatsDashboard from '../components/stats/StatsDashboard';
import MonthlyGoals from '../components/stats/MonthlyGoals';
import BookList from '../components/books/BookList';
import BookForm from '../components/books/BookForm';
import SessionForm from '../components/sessions/SessionForm';
import SessionList from '../components/sessions/SessionList';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import toast from 'react-hot-toast';
import ErrorMessage from '../components/common/ErrorMessage';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import sessionService from '../services/sessionService';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const { books, loading, error, fetchBooks, addBook, updateBook, deleteBook, pagination, loadMore, searchBooks, activeSearch } = useBooks();

  const [showAddBook, setShowAddBook] = useState(false);
  const [showEditBook, setShowEditBook] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchTerm);
  };

  // Handle Add Book
  const handleAddBook = async (bookData) => {
    setFormLoading(true);
    try {
      await addBook(bookData);
      setShowAddBook(false);
    } catch (error) {
      console.error('Failed to add book:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Edit Book
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowEditBook(true);
  };

  const handleUpdateBook = async (bookData) => {
    setFormLoading(true);
    try {
      await updateBook(selectedBook._id, bookData);
      setShowEditBook(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Failed to update book:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete Book
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book and all its sessions?')) {
      try {
        await deleteBook(bookId);
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  // Handle Log Session
  const handleLogSessionClick = (book) => {
    setSelectedBook(book);
    setShowLogSession(true);
  };

  const handleLogSession = async (sessionData) => {
    setFormLoading(true);
    try {
      await sessionService.createSession(sessionData);
      toast.success('Session logged successfully!');
      setShowLogSession(false);
      setSelectedBook(null);
      await fetchBooks(); // Refresh books to update progress
    } catch (error) {
      console.error('Failed to log session:', error);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading your library..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} onRetry={fetchBooks} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stats Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Reading Stats</h2>
        <StatsDashboard />
      </section>

      {/* Monthly Goals Section */}
      <section className="mb-8">
        <MonthlyGoals
          booksGoal={user?.booksGoal || 3}
          pagesGoal={user?.pagesGoal || 500}
          onUpdate={async (newGoals) => {
            await updateProfile({
              ...user,
              booksGoal: newGoals.booksGoal,
              pagesGoal: newGoals.pagesGoal
            });
          }}
        />
      </section>

      {/* Recent Activity Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <SessionList />
      </section>

      {/* Books Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Your Books</h2>

          <div className="flex gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>

            <Button
              onClick={() => setShowAddBook(true)}
              icon={Plus}
              variant="primary"
              className="whitespace-nowrap"
            >
              Add Book
            </Button>
          </div>
        </div>

        <BookList
          books={books}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onLogSession={handleLogSessionClick}
          onAdd={() => setShowAddBook(true)}
          isSearching={!!activeSearch}
        />

        {pagination?.hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={loadMore}
              variant="secondary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </section>

      {/* Add Book Modal */}
      <Modal
        isOpen={showAddBook}
        onClose={() => setShowAddBook(false)}
        title="Add New Book"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setShowAddBook(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={showEditBook}
        onClose={() => {
          setShowEditBook(false);
          setSelectedBook(null);
        }}
        title="Edit Book"
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleUpdateBook}
          onCancel={() => {
            setShowEditBook(false);
            setSelectedBook(null);
          }}
          loading={formLoading}
        />
      </Modal>

      {/* Log Session Modal */}
      <Modal
        isOpen={showLogSession}
        onClose={() => {
          setShowLogSession(false);
          setSelectedBook(null);
        }}
        title="Log Reading Session"
      >
        {selectedBook && (
          <SessionForm
            book={selectedBook}
            onSubmit={handleLogSession}
            onCancel={() => {
              setShowLogSession(false);
              setSelectedBook(null);
            }}
            loading={formLoading}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default Dashboard;