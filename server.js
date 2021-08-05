// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').config()
// }
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Import Route
const indexRoute = require('./routes/index')
const authorRoute = require('./routes/authors')
const bookRoute = require('./routes/book')

// Setup Views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

// Use Middleware
const middleware = [
    expressLayout,
    express.json(),
    express.static('public'),
    bodyParser.urlencoded({limit:'10mb', extended:false}),
    methodOverride('_method')
    
]
app.use(middleware)

// Use Route
app.use('/', indexRoute)
app.use('/authors', authorRoute)
app.use('/books', bookRoute)

// App Listen & Setup Data-Base
const port = process.env.PORT || 5050
const monogURI = 'mongodb+srv://User01:user01@cluster0.snr3u.mongodb.net/MyLiabry?retryWrites=true&w=majority'
mongoose.connect(monogURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
app.listen(port, (e)=>{
    console.log(`SERVER IS RUNNING ON PORT ${port}`)
})