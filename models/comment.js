const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
	{
		userid  : { type: String, required: true, unique: true },
		bookid  : { type: String, required: true, unique: true },
        cmt     : { type: String, required : true}
	},
    {
        timestamps : true
    },
	{ collection: 'comments' }
)

const commentModel = mongoose.model('CommentSchema', CommentSchema)

module.exports = commentModel