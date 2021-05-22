const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
	{
		userid  : { type: String, required: true },
		bookid  : { type: String, required: true },
        cmt     : { type: String, required : true}
	},
    {
        timestamps : true
    },
	{ collection: 'comments' }
)

const commentModel = mongoose.model('comments', CommentSchema)

module.exports = commentModel