const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		email: {
			type: String, required: true, unique: true, lowercase: true,
		}
	},
	{ collection: 'users' }
)

const userModel = mongoose.model('UserSchema', UserSchema)

module.exports = userModel