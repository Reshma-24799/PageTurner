import api from './api';

const bookService = {
    // Get all books
    getBooks: async () => {
        const response = await api.get('/books');
        return response.data.data;
    },

    // Get single book
    getBook: async (id) => {
        const response = await api.get(`/books/${id}`);
        return response.data.data;
    },

    // Create book
    createBook: async (bookData) => {
        const response = await api.post('/books', bookData);
        return response.data.data;
    },

    // Update book
    updateBook: async (id, bookData) => {
        const response = await api.put(`/books/${id}`, bookData);
        return response.data.data;
    },

    // Delete book
    deleteBook: async (id) => {
        const response = await api.delete(`/books/${id}`);
        return response.data;
    },
};

export default bookService;