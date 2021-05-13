const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true},
        bookname: { type: String, required: true },
        author: { type: String, required: true},
        description: { type: String, required: true},
        uploader: { type: String, required: true},
        uploadtime: {type: Date, required: true},
        category: {type: String, required: true}
    },
    { collection: 'books' }
)

const bookModel = mongoose.model('BookSchema', BookSchema)

module.exports = bookModel