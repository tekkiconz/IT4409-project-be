const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
    {
        userid: {
            type: String,
            require: true
        },
        bookid: {
            type: String,
            require: true
        },
        bookname:{
            type: String,
            require: true
        },
        nameact:{
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    },
    {
        collection: 'activity'
    }
)

const activityModel = mongoose.model('ActivitySchema', ActivitySchema)
module.exports = activityModel;