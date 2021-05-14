const express = require('express');
const router = express.Router();
const BOOKS_PER_PAGE = require('../helpers/configs').NUMBER_BOOK_PER_PAGE;
const Book = require('../models/book');
const Like = require('../models/like');
const Comment = require('../models/comment');


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

// ------------------- POST ---------------------------
// POST /api/books
router.post('books', async (req, res) => {
    var newBook = new Book({
        bookname: req.body.bookname,
        author: req.body.author,
        description: req.body.descript,
        userid: req.body.userid,
        category: req.body.category,
        likesCount: 0
    });

    await newBook.save()
        .then(() => {
            res.status(200).json(newBook).end();
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// POST /api/books/5/likes
router.post('books/:bookID/likes', async (req, res) => {
    var bid = req.params.bookid;
    var uid = req.params.userid;
    await Like.findOne({ bookid: bid, userid: uid })
        .then(data => {
            if (data) {
                res.status(403).end(`User ${uid} liked book ${bid}`);
            } else {
                let currLikeCount = data.likesCount;
                let newLike = new Like({
                    userid: uid,
                    bookid: bid
                });

                newLike.save()
                    .then(() => {
                        console.log(`User ${uid} has liked book ${id}`);
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
            }
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

// POST /api/books/5/comments
router.post('books/:bookID/comments', async (req, res) => {
    var bid = req.params.bookID;
    var newCmt = new Comment({
        userid : req.body.uid,
        bookid : bid,
        cmt : req.body.cmt
    });
    await newCmt.save()
        .then(()=>{
            res.status(200).end(`New comment on book ${bid}`);
        })
        .catch(err => console.log(`Error: ${err.message}`));
});

module.exports = router;