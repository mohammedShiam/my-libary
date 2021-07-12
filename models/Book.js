// const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const path = require('path')
const coverImageBasePath = 'uploads/bookCover'
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Authors",
  },
  coverImageName: {
    type: String,
    required: true,
  },
});

bookSchema.virtual('coverImagePath').get(function(){
  if(this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})


module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath