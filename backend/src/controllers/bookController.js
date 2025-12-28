import Book from '../models/Book.js';
// @desc    Get all books for user
// @route   GET /api/books
// @access  Private
export const getBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Book.countDocuments({ user: req.user.id });

    const books = await Book.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: books.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Make sure user owns book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Set dates based on status
    if (req.body.status === 'Currently Reading' || req.body.status === 'Completed') {
      req.body.startDate = new Date();
    }
    if (req.body.status === 'Completed') {
      req.body.completedDate = new Date();
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Make sure user owns book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Check if book is being completed
    if (req.body.status === 'Completed' && book.status !== 'Completed') {
      req.body.completedDate = new Date();
      if (!book.startDate) {
        req.body.startDate = new Date();
      }
    }

    // Check if book is being started
    if (req.body.status === 'Currently Reading' && book.status === 'Want to Read') {
      req.body.startDate = new Date();
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Make sure user owns book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,

      data: {}
    });
  } catch (error) {
    next(error);
  }
};