const router = require("express").Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// All Books
router.get("/", async (req, res, next) => {
    let query = Book.find();

    if (req.query.title != null && req.query.title != "") {
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }

    if (req.query.publishBefore != null && req.query.publishBefore != "") {
        query = query.lte("publishDate", req.query.publishBefore);
    }

    if (req.query.publishAfter != null && req.query.publishAfter != "") {
        query = query.gte("publishDate", req.query.publishAfter);
    }

    try {
        const books = await query.exec();
        res.render("../views/books/index.ejs", {
            books: books,
            searchOptions: req.query,
        });
    } catch {
        res.redirect("/");
    }
});

// Get a New Books Page
router.get("/new", async (req, res, next) => {
    renderNewPage(res, new Book());
});

// Creat a new book
router.post("/", async (req, res, next) => {
    const book = await new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
    });
    saveCover(book, req.body.cover);
    try {
        const newBook = await book.save();
        res.redirect("/books");
    } catch (err) {
        console.log(err);
        renderNewPage(res, book, true);
    }
});

// Get a book for show
router.get("/:id", async (req, res) => {
    try{
        // const book = await Book.findById(req.params.id).populate("author").exec();
        const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
        res.render('../views/books/show.ejs', {book:book})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
});
// Get a Book Edit Page
router.get("/:id/edit", async(req, res, next) => {
    try{
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book);

    }catch{
        res.redirect('/')
    }
});

// Update Book
router.put('/:id', async(req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch(e){
        if(book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }  
    }
})

// Delete Book
router.delete('/:id', async(req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }catch{
        if(book !=null){
            res.render('books/show',
            {
                book: book,
                errorMessage:'Could not remove book!'
            })
        }else{
            res.redirect('/')
        }
    }
})
// External Function Written
async function renderNewPage(res, book, hassError = false) {
    try {
        const authors = await Author.find({});
        // const book = await new Book()
        const params = {
            authors: authors,
            book: book,
        };
        if (hassError) params.errorMessage = "Error Creating Book";

        res.render("../views/books/new.ejs", params);
    } catch {
        res.redirect("/books");
    }
}
async function renderEditPage(res, book, hassError = false) {
    renderFormPage(res, book, 'edit', hassError)
}
async function renderFormPage(res, book, form, hassError = false){
    try {
        const authors = await Author.find({});
        // const book = await new Book()
        const params = {
            authors: authors,
            book: book,
        };
        if (hassError) {
            if(form === 'edit'){
                params.errorMessage = "Error Updating Book";
            }else{
                params.errorMessage = "Error Creating Book";
            }
        }

        res.render(`../views/books/${form}`, params);
    } catch {
        res.redirect("/books");
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);

    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
}

module.exports = router;