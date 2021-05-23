const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
<<<<<<< HEAD
		email: {
			type: String, required: true, unique: true, lowercase: true,
		}
=======
        email	: { type: String, required: true, unique: true, lowercase: true}
>>>>>>> bb148c99f3f60fd6fd231b0ffdb1cddfbff50342
	},
	{ collection: 'users' }
)

const userModel = mongoose.model('UserSchema', UserSchema)

module.exports = userModel