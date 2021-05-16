const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true},
		password: { type: String, required: true },
        email	: { type: String, required: true, unique: true, lowercase: true, 
		validate: value =>{
			if(!validator.isEmail(value)){
				throw new Error({error: 'Invalid Email'})
			}	
		} }
	},
	{ collection: 'users' }
)

const userModel = mongoose.model('UserSchema', UserSchema)

module.exports = userModel