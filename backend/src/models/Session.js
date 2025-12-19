import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book:{
        type: mongoose.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    startPage: {
        type: Number,
        required: [ true, 'Please add start page' ],
        min: 0
    },
    endPage: {
        type: Number,
        required: [ true, 'Please add end page' ],
        min: 0
    },
    pagesRead: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        default: '',
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

// Middleware to calculate pagesRead before saving
sessionSchema.pre('save', function(next) {
    this.pagesRead = this.endPage - this.startPage;
    next();
});

const Session = mongoose.model('Session', sessionSchema);
 export default Session;