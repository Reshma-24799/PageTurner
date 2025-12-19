import Session from '../models/Session.js';
import Book from '../models/Book.js';

// @desc    Get all sessions for user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user.id })
      .populate('book', 'title author')
      .sort('-date');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sessions for a specific book
// @route   GET /api/sessions/book/:bookId
// @access  Private
export const getBookSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      user: req.user.id,
      book: req.params.bookId
    }).sort('-date');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Check if book exists and belongs to user
    const book = await Book.findById(req.body.book);
    if (!book || book.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Calculate pages read
    const pagesRead = req.body.endPage - req.body.startPage;
    if (pagesRead < 0) {
      return res.status(400).json({ success: false, message: 'End page cannot be less than start page' });
    }

    const session = await Session.create({
      ...req.body,
      pagesRead,
      date: req.body.date || Date.now()
    });

    // Update book's current page
    book.currentPage = req.body.endPage;

    // Update book status
    if (book.status === 'Want to Read') {
      book.status = 'Currently Reading';
      book.startDate = new Date();
    }

    if (book.currentPage >= book.totalPages) {
      book.status = 'Completed';
      book.completedDate = new Date();
    }

    await book.save();

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = async (req, res, next) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Make sure user owns session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Make sure user owns session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};