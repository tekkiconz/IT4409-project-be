const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema(
	{
		userid: { type: String, required: true},
		bookid: { type: String, required: true}        
	},
	{ collection: 'likes' }
)

const likeModel = mongoose.model('likes', LikeSchema)

module.exports = likeModel