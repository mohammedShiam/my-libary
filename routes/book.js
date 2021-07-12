const router = require('express').Router()
const Author = require('../models/Authors')
const Book = require('../models/Book')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)
const multer = require('multer')
const upload = multer({
    dest:uploadPath,
    fileFilter:function(req, file, cb){
        checkFileType(file, cb)
    }
})

function checkFileType(file, cb){
    // Allowed Extention
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return cb(null, true)
    }
}

// All Books
router.get('/', async(req, res, next)=>{
    let query = Book.find()
    
    if(req.query.title != null && req.query.title != ''){
        
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }

    if(req.query.publishBefore != null && req.query.publishBefore != ''){
        query = query.lte('publishDate', req.query.publishBefore)
    }

    if(req.query.publishAfter != null && req.query.publishAfter != ''){
        query = query.gte('publishDate', req.query.publishAfter)
    }
    
    try{
        const books = await query.exec()
        res.render('../views/books/index.ejs', {
        books:books,
        searchOptions:req.query
        })
    }catch{
        res.redirect('/')
    }
    
})

// Single Books
router.get('/new', async(req, res, next)=>{
    renderNewPage(res, new Book())
})

// Creat new book
router.post('/', upload.single('cover'), async(req, res, next)=>{
    // const {
    //     title,
    //     author,
    //     pageCount,
    //     description,

    // } = req.body 
    const fileName = req.file != null ? req.file.filename : null
    const book = await new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName:fileName,
        description:req.body.description,
    })
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch(err){
        // console.log(err)
        if(book.coverImageName != null){
        removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err=>{
        if(err)console.error(err)
    })
}

async function renderNewPage(res, book, hassError = false){
    try{
        
        const authors = await Author.find({})
        // const book = await new Book()
        const params = {
            authors:authors,
            book:book
        }
        if(hassError) params.errorMessage = 'Error Creating Book'
        
        res.render('../views/books/new.ejs', params)
    }catch{
        res.redirect('/books')
    }
}

module.exports = router