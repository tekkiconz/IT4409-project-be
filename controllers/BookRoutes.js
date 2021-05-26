const express = require('express');
const router = express.Router();
const BOOKS_PER_PAGE = require('../helpers/configs').BOOKS_PER_PAGE;
const COMMENTS_PER_PAGE = require('../helpers/configs').COMMENTS_PER_PAGE;
const host = require('../helpers/configs').HOST;
const Book = require('../models/book');
const Like = require('../models/like');
const Comment = require('../models/comment');
const Activity = require('../models/activity');
const Category = require('../models/category');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

const auth = require('./middleware/auth');


// ------------------- GET ---------------------------
// GET /api/books?page=1&orderBy=bookname
router.get('/', async (req, res) => {
    // page start at index 0
    var page = req.query.page;
    var ord = req.query.orderBy;
    var cat = req.query.category;
    var bid = req.query.bookid;

    // page start at 1
    if (!page) {
        page = 1;
    }

    var start = (page - 1) * BOOKS_PER_PAGE;
    var end = page * BOOKS_PER_PAGE;
    var queryObj = {};

    if (cat) queryObj.category = cat;
    else if (bid) queryObj._id = bid;

    // Sort: 1 -> ASC
    //      -1 -> DESC

    switch (ord) {
        case 'bookname':
            await Book.find(queryObj)
                .sort({ "bookname": 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: 'books not found' });
                    } else {
                        // data is an array of book-info
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
            break;
        case 'author':
            await Book.find(queryObj)
                .sort({ author: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: 'books not found' });
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
            break;
        case 'category':
            await Book.find(queryObj)
                .sort({ category: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: 'books not found' });
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
            break;
        case 'userid':
            await Book.find(queryObj)
                .sort({ userid: 1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: 'books not found' });
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
            break;
        default: // sort by name
            await Book.find(queryObj)
                .sort({ createdAt: -1 })
                .then(data => {
                    if (!data) {
                        res.status(404).json({ message: 'books not found' });
                    } else {
                        res.status(200).json(data.slice(start, end)).end();
                    }
                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
            break;
    }
});

// GET /api/books/5/likes?bookid=_
router.get('/:bookid/likes', auth, async (req, res) => {
    var bid = req.params.bookid;
    var uid = req.user._id;

    await Like.findOne({ bookid: bid, userid: uid })
        .then(data => {
            if (!data) {
                res
                    .status(200)
                    .json({ status: false })
                    .end();
            } else {
                res.status(200).json({ status: true }).end();
            }
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});


// GET /api/books/5/comments?bookid=_&page=_
router.get('/:bookid/comments', async (req, res) => {
    var bid = req.params.bookid;
    var page = req.query.page;
    console.log(bid, page);
    var start = (page - 1) * COMMENTS_PER_PAGE;
    var end = page * COMMENTS_PER_PAGE;

    await Comment.find({ bookid: bid }).sort({ createdAt: -1 })
        .then(data => {
            if (!data) {
                res
                    .status(404)
                    .json({ err: 'Fail to get book comments' })
                    .end();
            } else {
                console.log(data)
                res.status(200).json(data.slice(start, end));
            }
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

// GET /api/books/categories
router.get('/categories', async (req, res) => {
    await Category.find()
        .then(data => {
            if (JSON.stringify(data) == '[]') {
                res.status(404).json({ message: 'not found any categories' });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(`Error: ${err.message}`);
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

// GET /api/books/featuredbooks
router.get('/featuredbooks', async (req, res) => {
    await Book.find({})
        .sort({ 'likesCount': -1, 'createdAt': -1 })
        .then(data => {
            if (!data) {
                res.status(404).json({ message: 'Featured books not found' });
            } else {
                res.status(200).json(data.slice(0, 3)).end();
            }
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

// ------------------- POST ---------------------------
// POST /api/books
router.post('/', auth, async (req, res) => {
    console.log(req.files)
    var bookFile = req.files.bookfile;
    var prevFile = req.files.prevfile;
    console.log(bookFile);
    if (bookFile == null || prevFile == null) {
        console.log("haha")
        res.status(400).json({ message: 'Not found bookfile or frevfile' })
    }
    else {
        var exts = prevFile.name.split('.');
        var ext = '.' + exts[exts.length - 1];

        // get book's info
        var newBook = new Book({
            bookname: req.body.bookname,
            author: req.body.author,
            description: req.body.description,
            userid: req.user._id,
            category: req.body.category,
            likesCount: 0,
            bookpath: `${host}/books/book_test.pdf`,
            prevpath: `${host}/book-previews/img_test.png`,
        });

        var newActivity = new Activity({
            bookid: newBook._id,
            bookname: newBook.bookname,
            userid: req.user._id,
            nameact: 'Post Book'
        })

        // // save book's info
        // await newBook.save((err, book) => {
        //     if (err) {
        //         res.status(400).json({message :`Error: ${err.message}`});
        //     }
        //save activity        
        try {
            newActivity.save();
        }
        catch (err) {
            res.status(400).json({ message: `Error: ${err.message}` });
        }
        newBook.bookpath = `${host}/books/book_${newBook._id}.pdf`;
        newBook.prevpath = `${host}/book-previews/img_${newBook.id}${ext}`;

        // save book's info
        await newBook.save((err, book) => {
            if (err) {
                console.log(err)
                res.status(400).json({ message: `Error: ${err.message}` });//gui response ve
            }
            else {
                //save activity        
                try {
                    newActivity.save();
                }
                catch (err) {
                    res.status(400).json({ message: `Error: ${err.message}` });
                }

                // save file to server                        
                bookFile.mv(process.cwd() + `/public/books/book_${book.id}.pdf`, error => {
                    if (error) {
                        res.status(400).json({ message: `Error: ${err.message}` });
                    }

                });
                prevFile.mv(process.cwd() + `/public/book-previews/img_${book.id}${ext}`, error => {
                    if (error) {
                        res.status(400).json({ message: `Error: ${err.message}` });
                    }
                });

                res.status(200).json(newBook);
            }
        });
    }
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
            var increase = 1;
            if (data) {

                console.log(bid, uid);
                Like.findOneAndDelete({ bookid: bid, userid: uid })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch(err => res.status(400).json({ message: err.message }));

                increase = -1;
            } else {
                let newLike = new Like({
                    userid: uid,
                    bookid: bid
                });

                newLike.save()
                    .then(() => {
                        console.log(`User ${uid} has ${(increase == 1) ? 'liked' : 'un-liked'} book ${bid}`);
                    })
                    .catch(err => res.status(400).json({ message: err.message }));

                increase = 1;
            }

            Book.findOne({ _id: bid })
                .then(bdata => {
                    var newActivity = new Activity({
                        bookid: bid,
                        userid: req.user._id,
                        nameact: (increase == 1) ? 'Like' : 'Unlike'
                    })
                    try {
                        newActivity.save();
                    }
                    catch (err) {
                        res.status(400).json({ message: `Error: ${err.message}` });
                    }
                    let currLikeCount = bdata.likesCount;

                    var b = new Book({
                        _id: bid,
                        bookname: bdata.bookname,
                        author: bdata.author,
                        description: bdata.description,
                        userid: bdata.userid,
                        category: bdata.category,
                        likesCount: currLikeCount + increase
                    })
                    console.log(b.likesCount)

                    Book.findOneAndUpdate({ _id: bid }, b, { upsert: true }, function (err, doc) {
                        if (err) console.log(err)
                    });
                    res.status(200).json({ message: `${(increase == 1) ? 'Increased' : 'Decreased'} likeCounts` });

                })
                .catch(err => {
                    res.status(400).json({ message: `Error: ${err.message}` });
                });
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });

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
            res.status(200).json({ message: `New comment on book ${bid}` });
            //save activity
            try {
                newActivity.save();
            }
            catch (err) {
                res.status(400).json({ message: `Error: ${err.message}` });
            }
            // console.log(newActivity)
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });//gui response ve
        });
});

// POST /api/books/categories
router.post('/categories', async (req, res) => {
    var ctype = req.body.type;
    // console.log(ctype)
    var newCat = new Category({
        name: ctype
    });
    await newCat.save()
        .then(() => {
            res.status(200).json({ message: `New category: ${ctype}` });
        })
        .catch(err => {
            res.status(400).json({ message: `Error: ${err.message}` });
        });
});

module.exports = router;