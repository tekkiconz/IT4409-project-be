const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema(
    {
        bookname: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String, required: true },
        userid: { type: String, required: true },
        category: { type: String, required: true },
        likesCount: { type: Number, required: true },
        bookpath: { type: String, required: true },
        prevpath: { type: String, required: true }
    },
    {
        timestamps: true
    },
    { collection: 'books' }
)

const bookModel = mongoose.model('books', BookSchema)

module.exports = bookModel