import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true
    },
    totalPages: {
        type: Number,
        required: [true, 'Please add the total number of pages']    ,
        min: 1
    },
    currentPage: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['Want to Read', 'Currently Reading', 'Completed'],
        default: 'Want to Read'
    },
    coverUrl: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    startDate: {
        type: Date,
        default: null
    },
    completedDate: {
        type: Date,
        default: null
    },
    streakDays: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

//Calculate progress percentage
bookSchema.virtual('progress').get(function() {
    return Math.round((this.currentPage/this.totalPages) * 100);
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;