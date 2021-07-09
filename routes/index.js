const router = require('express').Router()


// Root Route
router.get('/', (req, res, next)=>{
    res.render('../views/index.ejs')
})





module.exports = router