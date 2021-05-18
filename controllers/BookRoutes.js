const express = require('express');
const router = express.Router();
const BOOKS_PER_PAGE = require('../helpers/configs').NUMBER_BOOK_PER_PAGE;
const Book = require('../models/book');
const Like = require('../models/like');
const Comment = require('../models/comment');
const Activity = require('../models/activity');
const auth = require('./middleware/auth');


// ------------------- GET ---------------------------
// GET /api/books
router.get('/books', async (req, res) => {

    // page start at index 0
    var page = req.query.page;
    var ord = req.query.orderBy;
    var cat = req.query.category;

    var start = page * BOOKS_PER_PAGE;
    var end   = (page + 1) * BOOKS_PER_PAGE;

    // Sort: 1 -> ASC
    //      -1 -> DESC

    switch (ord) {
        case 'bookName':
            await Book.find(cat ? { category: cat } : {})
                .sort({ bookname: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).end('books not found');
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => console.log(`Error: ${err.message}`));
            break;
        case 'author':
            await Book.find(cat ? { category: cat } : {})
                .sort({ author: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).end('books not found');
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => console.log(`Error: ${err.message}`));
            break;
        case 'category':
            await Book.find(cat ? { category: cat } : {})
                .sort({ category: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).end('books not found');
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => console.log(`Error: ${err.message}`));
            break;
        case 'userid':
            await Book.find(cat ? { category: cat } : {})
                .sort({ userid: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).end('books not found');
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => console.log(`Error: ${err.message}`));
            break;
        default: // sort by name
            await Book.find(cat ? { category: cat } : {})
                .sort({ bookname: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).end('books not found');
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => console.log(`Error: ${err.message}`));
            break;
    }
});

// GET /api/books/5
router.get('/books/:bookID', async (req, res) => {
    var bid = req.params.bookID;
    console.log(bid);
    await Book.findOne({ _id: bid })
        .then(data => {
            if (!data) {
                res
                    .status(404)
                    .json({ err: `Book (ID : ${bid}) not found` })
                    .end();
            } else {
                res.status(200).json(data).end();
            }
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// GET /api/books/5/likes
router.get('/books/:bookID/likes', async (req, res) => {
    var bid = req.params.bookID;
    await Book.findOne({ _id: bid })
        .then(data => {
            if (!data) {
                res
                    .status(400)
                    .json({ err: 'Fail to get book likesCount' })
                    .end();
            } else {
                res.status(200).json({ likes: data.likesCount }).end();
            }
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// GET /api/books/5/comments
router.get('/books/:bookID/comments', async (req, res) => {
    var bid = req.params.bookID;

    await Comment.find({ bookID: bid }).sort({createAt : 1})
        .then(data => {
            if (!data) {
                res
                    .status(404)
                    .json({ err: 'Fail to get book comments' })
                    .end();
            } else {
                console.log('books:', data);
                res.status(200).json(data).end();
            }
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// GET /api/books/category/5
router.get('/books/category/:bid', async (req, res) => {
    var bid = req.params.bid;
    await Book.findOne({_id : bid})
        .then(data => {
            if(!data){
                res.status(404).end('Book not found');
            }
            res.status(200).json({category : data.category}).end();
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// ------------------- POST ---------------------------
// POST /api/books
router.post('/', auth,  async (req, res) => {
    var newBook = new Book({
        bookname: req.body.bookname,
        author: req.body.author,
        description: req.body.description,
        userid: req.user._id,
        category: req.body.category,
        likesCount: 0
    });
    var newActivity = new Activity({
        bookid: newBook._id,
        bookname: newBook.bookname,
        userid: req.user._id,
        nameact: 'Post Book'
    })
    newActivity.save();
    console.log(newActivity)

    await newBook.save()
        .then(() => {
            res.status(200).json(newBook).end();
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// POST /api/books/5/likes
router.post('/:bookID/likes', auth,  async (req, res) => {
    var bid = req.params.bookID;
    var uid = req.user._id;
    const book = Book.findOne({_id:bid});
    if (!book) {
        throw new Error()
    }
    
    
    await Like.findOne({ bookid: bid, userid: uid })
        .then(data => {
            if (data) {
                res.status(403).end(`User ${uid} liked book ${bid}`);
            } else {
                Book.findOne({_id:bid})
                    .then(bdata => {
                        var newActivity = new Activity({
                            bookid: bid,
                            userid: req.user._id,
                            nameact: 'Like'
                        })
                        newActivity.save()
                        let currLikeCount = bdata.likesCount;    
                        let newLike = new Like({
                            userid: uid,
                            bookid: bid
                        });
        
                        newLike.save()
                            .then(() => {
                                console.log(`User ${uid} has liked book ${bid}`);
                            })
                            .catch(err => console.log(`Error: ${err.message}`));
                            
                        Book.updateOne(
                            { _id: bid },
                            {
                                $set: {
                                    "likesCount": currLikeCount + 1
                                }
                            }
                        );
                    })
                    .catch(err => console.log(`Error: ${err.message}`));
            }
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// POST /api/books/5/comments
router.post('/:bookID/comments', auth, async (req, res) => {
    var bid = req.params.bookID;
    var newCmt = new Comment({
        userid : req.user._id,
        bookid : bid,
        cmt : req.body.cmt
    });
    var newActivity = new Activity({
        bookid: bid,
        userid: req.user._id,
        nameact: 'Comment'
    })
    newActivity.save()
    console.log(newActivity)
    await newCmt.save()
        .then(()=>{
            res.status(200).end(`New comment on book ${bid}`);
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

module.exports = router;