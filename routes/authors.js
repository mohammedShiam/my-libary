const router = require('express').Router()
const Author = require('../models/Authors')

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

// Single Authors
router.get('/new', (req, res, next)=>{
    res.render('../views/authors/new.ejs', {author: new Author()})
})

router.post('/new', async(req, res, next)=>{
    const author = new Author({name:req.body.name})
    try{
        const newAuthor = await author.save()
        res.redirect('/authors')
        // res.redirect(`/authors/${newAuthor.id}`)
    }catch{
        res.render('../views/authors/new.ejs', {
            author:author,
            errorMessage:"Invalid Credential"
        })
    }
})



module.exports = router