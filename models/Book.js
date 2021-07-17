// const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const path = require('path');
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
  coverImage:{
    type: Buffer,
    required: true,
  },
  coverImageType:{
    type:String,
    required:true
  }
});

bookSchema.virtual('coverImagePath').get(function(){
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})


module.exports = mongoose.model("Book", bookSchema);