'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ""
  },
  // emotion: {
  //   type: String,
  //   default: ""
  // },
  user_id: Schema.ObjectId,
  image_url: {
    type: String
  },
  likes: { type: Array, default: [] }
});
// a setter
// PostSchema.path('name').set((inputString) => {
//   return inputString[0].toUpperCase() + inputString.slice(1);
// });

module.exports = mongoose.model('Post', PostSchema);