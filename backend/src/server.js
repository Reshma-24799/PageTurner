import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);

//Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})