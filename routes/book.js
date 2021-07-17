const router = require('express').Router()
const Author = require('../models/Authors')
const Book = require('../models/Book')

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

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
router.post('/', async(req, res, next)=>{

    const book = await new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description:req.body.description,
    })
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch(err){
        console.log(err)
        renderNewPage(res, book, true)
    }
})

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
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