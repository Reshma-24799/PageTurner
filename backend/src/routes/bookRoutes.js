 import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getBooks, createBook, getBook, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBooks)
  .post(createBook);

router.route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

export default router;