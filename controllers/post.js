// http://www.codingpedia.org/ama/cleaner-code-in-nodejs-with-async-await-mongoose-calls-example#before
const mongoose = require("mongoose");
const fs = require("fs")
const Post = require("../models/post");
const _ = require('lodash')

// res.setHeader('Content-Type', 'application/json');
//https://stackoverflow.com/questions/33627238/mongoose-find-with-multiple-conditions
// https://stackoverflow.com/questions/53030827/populate-data-using-another-collection-array-in-mongoose
exports.get_all_post = async (req, res, next) => {
  let criteria = {}
  if (mongoose.Types.ObjectId.isValid(req.query.user_id)) {
    criteria.userID = mongoose.Types.ObjectId(req.query.user_id)
  }
  // skip: lấy từ phần tử số skip đó trở đi
  try {
    const limit = parseInt(req.query.limit, 0) || 10;
    const skip = parseInt(req.query.skip, 0) || 0;
    const postResult = await Post.find(criteria)
      .populate('user_id', 'user_name email _id avatar_url')
      // .populate({ path: 'user_id', select: 'email' })
      .skip(skip).limit(limit).sort({ created_date: 1 }) // sort theo title
    // .select("title content location created_date user_id image_url likes ")
    res.status(200).json({
      result: "ok",
      data: postResult,
      count: postResult.length,
      message: "Query list of posts successfully"
    })
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }

  // Post.find(criteria).limit(100).sort({ title: 1 })
  //   .select("title content category tag location created_date userID imageUrl").exec((err, posts) => {
  //     if (err) {
  //       res.json({
  //         result: "failed",
  //         data: [],
  //         message: `Error is : ${err}`
  //       });
  //     } else {
  //       res.json({
  //         result: "ok",
  //         data: posts,
  //         count: posts.length,
  //         message: "Query list of posts successfully"
  //       });
  //     }
  //   });
};


exports.update_post = async (req, res, next) => {
  let conditions = {};//search record with "conditions" to update
  if (mongoose.Types.ObjectId.isValid(req.body.postId)) {
    conditions._id = mongoose.Types.ObjectId(req.body.postId);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: "You must enter postId to update"
    });
  }

  let newValues = {
    ...req.body,
    image_url: _.get(req, 'file.path', ''),
    user_id: mongoose.Types.ObjectId(req.userData.userId)
  };

  if (newValues.like) {
    const curPost = await Post.findById(req.body.postId).exec();
    const isInclude = curPost.likes.includes(newValues.like)
    const remain = isInclude ? curPost.likes.filter(e => e !== newValues.like) : curPost.likes.concat([newValues.like])
    newValues.likes = remain
  }

  const options = {
    new: true, // return the modified document rather than the original.
    multi: true
  }

  Post.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedPost) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Cannot update existing post. Error is : ${err}`
      });
    } else {
      res.json({
        result: "ok",
        data: updatedPost,
        message: "Update post successfully"
      });
    }
  });
};

exports.get_detail_post = (request, response, next) => {
  Post.findById(mongoose.Types.ObjectId(request.query.postId),
    (err, post) => {
      if (err) {
        response.json({
          result: "failed",
          data: {},
          message: `Error is : ${err}`
        });
      } else {
        response.json({
          result: "ok",
          data: post,
          message: "Query post by Id successfully"
        });
      }
    });
};

exports.create_post = (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    location: req.body.location,
    user_id: mongoose.Types.ObjectId(req.userData.userId),
    image_url: _.get(req, 'file.path', '')
  });
  post.save((err) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is : ${err}`
      });
    } else {
      res.json({
        result: "ok",
        message: "Insert new post successfully"
      });
    }
  });
};

//http://localhost:3000/open-image?image_name=uploads/2018-12-12T04:43:50.787Z47390714_767819240231467_8016730945325367296_n.jpg
exports.open_image = (request, response, next) => {
  // let imageName = "uploads/" + request.query.image_name;
  let imageName = request.query.image_name;
  fs.readFile(imageName, (err, imageData) => {
    if (err) {
      response.json({
        result: "failed",
        message: `Cannot read image.Error is : ${err}`
      });
      return;
    }
    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    response.end(imageData); // Send the file data to the browser.
  });
};

exports.post_delete = (req, res, next) => {
  Post.findOneAndRemove({ _id: mongoose.Types.ObjectId(req.params.postId) }, (err) => {
    if (err) {
      res.json({
        result: "failed",
        message: `Cannot delete Post with Id: ${req.params.postId}. Error is : ${err}`
      });
      return;
    }
    res.json({
      result: "ok",
      message: `Delete category and Post with post Id ${req.params.postId} successful`
    });
  });
};

exports.post_delete_many = async (req, res, next) => {
  Post.deleteMany({ _id: { $in: req.body.ids } }, (err, response) => {
    if (err) {
      res.json({
        result: "failed",
        message: `Cannot delete Post with Id: ${req.params.postId}. Error is : ${err}`
      });
      return;
    }
    res.json({
      result: "ok",
      message: `Delete successful`
    });
  })
};
exports.post_delete_all = async (req, res, next) => {
  Post.deleteMany({}, (err, response) => {
    if (err) {
      res.json({
        result: "failed",
        message: `Cannot delete Post with Id: ${req.params.postId}. Error is : ${err}`
      });
      return;
    }
    res.json({
      result: "ok",
      message: `Delete all successful`
    });
  })
};