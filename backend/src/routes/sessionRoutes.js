import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getSessions, createSession, getBookSessions, updateSession, deleteSession } from '../controllers/sessionController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSessions)
  .post(createSession);

router.get('/book/:bookId', getBookSessions);

router.route('/:id')
  .put(updateSession)
  .delete(deleteSession);

export default router;