import Session from '../models/Session.js';
import Book from '../models/Book.js';

// @desc    Get reading statistics
// @route   GET /api/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all sessions
    const allSessions = await Session.find({ user: req.user.id });
    const sessions7Days = allSessions.filter(s => new Date(s.date) > last7Days);
    const sessions30Days = allSessions.filter(s => new Date(s.date) > last30Days);

    // Calculate pages read
    const totalPages7Days = sessions7Days.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalPages30Days = sessions30Days.reduce((sum, s) => sum + s.pagesRead, 0);
    const totalPagesAllTime = allSessions.reduce((sum, s) => sum + s.pagesRead, 0);

    // Calculate unique active days
    const uniqueDays7 = new Set(sessions7Days.map(s => s.date.toISOString().split('T')[0])).size;
    const uniqueDays30 = new Set(sessions30Days.map(s => s.date.toISOString().split('T')[0])).size;

    // Get books data
    const allBooks = await Book.find({ user: req.user.id });
    const completedBooks = allBooks.filter(b => b.status === 'Completed');
    const completedThisMonth = completedBooks.filter(b =>
      b.completedDate && new Date(b.completedDate) >= monthStart
    );

    // Calculate averages
    const avg7Days = uniqueDays7 > 0 ? Math.round(totalPages7Days / uniqueDays7) : 0;
    const avg30Days = uniqueDays30 > 0 ? Math.round(totalPages30Days / uniqueDays30) : 0;

    res.status(200).json({
      success: true,
      data: {
        averages: {
          last7Days: avg7Days,
          last30Days: avg30Days
        },
        activeDays: {
          last7Days: uniqueDays7,
          last30Days: uniqueDays30
        },
        totalPages: {
          last7Days: totalPages7Days,
          last30Days: totalPages30Days,
          allTime: totalPagesAllTime
        },
        books: {
          total: allBooks.length,
          completed: completedBooks.length,
          completedThisMonth: completedThisMonth.length,
          currentlyReading: allBooks.filter(b => b.status === 'Currently Reading').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly goals progress
// @route   GET /api/stats/goals
// @access  Private
export const getGoalsProgress = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const sessions = await Session.find({
      user: req.user.id,
      date: { $gte: monthStart }
    });

    const books = await Book.find({
      user: req.user.id,
      status: 'Completed',
      completedDate: { $gte: monthStart }
    });

    const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const completedBooks = books.length;

    res.status(200).json({
      success: true,
      data: {
        pagesRead: totalPages,
        booksCompleted: completedBooks
      }
    });
  } catch (error) {
    next(error);
  }
};