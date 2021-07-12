const router = require('express').Router()
const Book = require('../models/Book')

// Root Route
router.get('/', async(req, res, next)=>{
    let books
    try{
         books = await Book.find({}).sort({createdAt:'desc'}).limit(10).exec()
        
    }catch{
        books = []
    }
    res.render('../views/index.ejs', {books:books})
})





module.exports = router