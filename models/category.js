const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {        
        type : { type: String, required: true   }
    },
    { collection: 'categories' }
)

const categoryModel = mongoose.model('CategorySchema', CategorySchema)

module.exports = categoryModel