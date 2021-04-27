const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String,
    email: String
}, {
    collation: 'accounts'
});

const AccountModel = mongoose.model('accounts', AccountSchema)

module.exports = AccountModel