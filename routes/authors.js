const router = require('express').Router()
const Author = require('../models/Author')
const Book = require('../models/Book');

// All Authors
router.get('/', async(req, res, next)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('../views/authors/index.ejs', {
            authors:authors,
            searchOptions:req.query
        })
    }catch{
        res.riderect('/')
    }
})

// New Author
router.get('/new', (req, res, next)=>{
    res.render('../views/authors/new.ejs', {author: new Author()})
})

// Creat a Author
router.post('/new', async(req, res, next)=>{
    const author = new Author({name:req.body.name})
    try{
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    }catch{
        res.render('../views/authors/new.ejs', {
            author:author,
            errorMessage:"Invalid Credential"
        })
    }
})


router.get('/:id', async(req, res, next)=>{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({author:author.id}).limit(6).exec()
    try{
        res.render('../views/authors/show.ejs', {
            author:author,
            booksByAuthor:books
        })
    }catch(e){
        res.redirect('/')
    }
})

router.get('/:id/edit', async(req, res, next)=>{
    const author = await Author.findById(req.params.id)
    try{
        res.render('../views/authors/edit.ejs', {author:author})
    }catch(e){
        res.redirect('/authors')
    }
})

router.put('/:id', async(req, res, next)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch(e){
        if(author == null){
            res.redirect('/')
        }else{
            res.render('../views/authors/edit.ejs', {
                author:author,
                errorMessage:"Invalid Credential"
            })
        }  
    }
})
router.delete('/:id', async(req, res, next)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.redirect(`/authors/${author.id}`)
        }  
    }
})
module.exports = router