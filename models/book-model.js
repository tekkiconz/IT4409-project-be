const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    id: Number,
    bookname : String,
    author: String,
    description: String,
    uploader: String,
    uploadtime: Date,
    category: String
}, {
    collation: 'books'
});

const BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel;