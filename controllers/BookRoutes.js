const express = require('express');
const router = express.Router();
const BOOKS_PER_PAGE = require('../helpers/configs').BOOKS_PER_PAGE;
const COMMENTS_PER_PAGE = require('../helpers/configs').COMMENTS_PER_PAGE;
const Book = require('../models/book');
const Like = require('../models/like');
const Comment = require('../models/comment');
const Activity = require('../models/activity');
const Category = require('../models/category');
const fileUpload = require('express-fileupload');
const host = require('../helpers/configs').HOST;

router.use(fileUpload());

const auth = require('./middleware/auth');


// ------------------- GET ---------------------------
// GET /api/books
router.get('/', async (req, res) => {

    // page start at index 0
    var page = req.query.page;
    var ord = req.query.orderBy;
    var cat = req.query.category;

    var start = page * BOOKS_PER_PAGE;
    var end = (page + 1) * BOOKS_PER_PAGE;

    // Sort: 1 -> ASC
    //      -1 -> DESC

    switch (ord) {
        case 'bookName':
            await Book.find(cat ? { category: cat } : {})
                .sort({ bookname: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message:'books not found'});
                    } else {
                        // data is an array of book-info
                        // data.bookpath = `${host}/public/books/book_${data.id}.pdf`;
                        // data.prevpath = `${host}/public/book-previews/img_${data.id}${data.img_ext}`;
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(400).json({message :`Error: ${err.message}`});
                });
            break;
        case 'author':
            await Book.find(cat ? { category: cat } : {})
                .sort({ author: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({message:'books not found'});
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(400).json({message: `Error: ${err.message}`});
                });
            break;
        case 'category':
            await Book.find(cat ? { category: cat } : {})
                .sort({ category: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({message: 'books not found'});
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(400).json({message :`Error: ${err.message}`});
                });
            break;
        case 'userid':
            await Book.find(cat ? { category: cat } : {})
                .sort({ userid: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({message: 'books not found'});
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(400).json({message: `Error: ${err.message}`});
                });
            break;
        default: // sort by name
            await Book.find(cat ? { category: cat } : {})
                .sort({ bookname: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({message: 'books not found'});
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    console.log(`Error: ${err.message}`);
                    res.status(400).json({message: `Error: ${err.message}`});
                });
            break;
    }
});

// GET /api/books/5
router.get('/:bookID', async (req, res) => {
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
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// GET /api/books/5/likes
router.get('/:bookID/likes', async (req, res) => {
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
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// GET /api/books/5/comments
router.get('/:bookID/comments', async (req, res) => {
    var bid = req.params.bookID;
    var page = req.query.page;

    var start = page * COMMENTS_PER_PAGE;
    var end = (page + 1) * COMMENTS_PER_PAGE;

    await Comment.find({ bookID: bid }).sort({ createAt: 1 })
        .then(data => {
            if (!data) {
                res
                    .status(404)
                    .json({ err: 'Fail to get book comments' })
                    .end();
            } else {
                console.log('books:', data);
                res.status(200).json(data.slice(start, end)).end();
            }
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// GET /api/books/categories
router.get('/categories', async (req, res) => {
    await Category.find({})
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'not found any categories'});
            }
            res.status(200).json(data).end();
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// ------------------- POST ---------------------------
// POST /api/books
router.post('/', auth, async (req, res) => {
    var bookFile    = req.files.bookfile;
    var prevFile    = req.files.prevfile;
    var exts        = prevFile.name.split('.');
    var ext         = '.' + exts[exts.length - 1];
    
    // get book's info
    var newBook = new Book({
        bookname    : req.body.bookname,
        author      : req.body.author,
        description : req.body.description,
        userid      : req.user._id,
        category    : req.body.category,        
        bookpath    : `${host}/books/book_test.pdf`,
        prevpath    : `${host}/book-previews/img_test.png`,
        likesCount  : 0
    });
    
    var newActivity = new Activity({
        bookid  : newBook._id,
        bookname: newBook.bookname,
        userid  : req.body.userid,
        nameact : 'Post Book'
    })

    newBook.bookpath = `${host}/books/book_${newBook._id}.pdf`;
    newBook.prevpath = `${host}/book-previews/img_${newBook.id}${ext}`;

    // save book's info
    await newBook.save((err, book) => {
        if (err) {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        }
        //save activity        
        try{
            newActivity.save();
        }
        catch(err){
            res.status(400).json({message: `Error: ${err.message}`});
        }

        // save file to server                        
        bookFile.mv(process.cwd() + `/public/books/book_${book.id}.pdf`, error => {
            if (error) {
                res.status(400).json({message: `Error: ${err.message}`});
            }

        });
        prevFile.mv(process.cwd() + `/public/book-previews/img_${book.id}${ext}`, error => {
            if (error) {
                res.status(400).json({message: `Error: ${err.message}`});
            }
        });

        res.status(200).json(newBook).end();
    });
});

// const fs = require('fs');
// // POST /api/books/images
// router.post('/images', async (req, res) => {
//     var Base64String = req.body.pdf;
//     var base64file = Base64String.split(';base64,').pop();
//     //console.log(base64Img);
//     fs.writeFile('book.pdf', base64file, {encoding: 'base64'}, function(err) {
//         console.log('File created');
//     });
//     res.end();
// })

// POST /api/books/5/likes
router.post('/:bookID/likes', auth, async (req, res) => {
    var bid = req.params.bookID;
    var uid = req.user._id;
    const book = Book.findOne({ _id: bid });
    if (!book) {
        throw new Error()
    }

    await Like.findOne({ bookid: bid, userid: uid })
        .then(data => {
            if (data) {
                res.status(403).json({message: `User ${uid} liked book ${bid}`});
            } else {
                Book.findOne({ _id: bid })
                    .then(bdata => {
                        var newActivity = new Activity({
                            bookid: bid,
                            userid: req.user._id,
                            nameact: 'Like'
                        })
                        try{
                            newActivity.save();
                        }
                        catch(err){
                            res.status(400).json({message: `Error: ${err.message}`});
                        }
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
                        
                        var b = new Book({
                            _id         : bid,
                            bookname    : bdata.bookname,
                            author      : bdata.author,
                            description : bdata.description,
                            userid      : bdata.userid,
                            category    : bdata.category,
                            likesCount  : currLikeCount + 1
                        })
                        console.log(b.likesCount)
                        Book.findOneAndUpdate({_id: bid}, b, {upsert: true}, function(err, doc) {
                            if (err) console.log(err)
                        });
                        res.status(200).end('Increase likeCounts')

                    })
                    .catch(err => {
                        console.log(`Error: ${err.message}`);
                        res.status(400).json({message: `Error: ${err.message}`});
                    });
            }
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// POST /api/books/5/comments
router.post('/:bookID/comments', auth, async (req, res) => {
    var bid = req.params.bookID;
    var newCmt = new Comment({
        userid: req.user._id,
        bookid: bid,
        cmt: req.body.cmt
    });
    var newActivity = new Activity({
        bookid: bid,
        userid: req.user._id,
        nameact: 'Comment'
    })
    await newCmt.save()
        .then(() => {
            res.status(200).end(`New comment on book ${bid}`);
            try{
                newActivity.save();
            }
            catch(err){
                res.status(400).json({message: `Error: ${err.message}`});
            }
            console.log(newActivity)
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

// POST /api/books/categories
router.post('/books/categories', async (req, res) => {
    var ctype = req.body.type;
    var newCat = new Category({
        type: ctype
    });
    await newCat.save()
        .then(() => {
            res.status(200).end(`New category: ${ctype}`);
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({message: `Error: ${err.message}`});
        });
});

module.exports = router;