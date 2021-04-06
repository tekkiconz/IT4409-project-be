const mongoose = require('mongoose');
// for online db
const CONNECTION_STRING = 'mongodb+srv://webteam29:bookshare20202@booksharecluster.ikeoh.mongodb.net/bookshare-account';
// for local db
// const CONNECTION_STRING = 'mongodb://localhost:27017/bookshare-account';

mongoose.connect(CONNECTION_STRING, 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

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