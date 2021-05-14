const mongoose = require('mongoose')
const Like = require('like');

const BookSchema = new mongoose.Schema(
    {        
        bookname    : { type: String, required: true   },
        author      : { type: String, required: true   },
        description : { type: String, required: true   },
        userid      : { type: String, required: true   },        
        category    : { type: String, required: true   },
        likesCount  : { type: Number, required: true  }
    },
    {
        timestamps : true
    },
    { collection: 'books' }
)

const bookModel = mongoose.model('BookSchema', BookSchema)

module.exports = bookModel