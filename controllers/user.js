const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require('lodash')

const User = require("../models/user");

// https://docs.mongodb.com/manual/reference/operator/query/

exports.get_users = async (req, res, next) => {
  try {
    const users = await User.find({}).limit(100).sort({ email: 1 }).select({ email: 1 }).exec()
    res.json({
      result: "ok",
      data: users,
      count: users.length,
      message: "Query list of users successfully"
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: [],
      message: `Error is : ${error}`
    });
  }
};

exports.get_me = async (req, res, next) => {
  try {
    const curUser = await User.findById(req.userData.userId).select("_id email user_name friends avatar_url").exec();
    res.json({
      result: "ok",
      data: curUser,
      count: curUser.length,
      message: "Query list successfully"
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: [],
      message: `Error is : ${error}`
    });
  }
};




exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              user_name: req.body.userName
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  // res.send('respond with a resource');
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            // process.env.JWT_KEY,
            'secret',
            {
              // expiresIn: "8h"
              expiresIn: "30 days"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.update_user = async (req, res, next) => {
  let conditions = {};//search record with "conditions" to update
  if (mongoose.Types.ObjectId.isValid(req.userData.userId)) {
    conditions._id = mongoose.Types.ObjectId(req.userData.userId);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: "You must enter postId to update"
    });
  }


  let newValues = {
    ...req.body,
    avatar_url: _.get(req, 'file.path', ''),
  };

  if (newValues.friend) {
    const curUser = await User.findById(req.userData.userId).exec();
    const isInclude = curUser.friends.includes(newValues.friend)
    const remain = isInclude ? curUser.friends.filter(e => e !== newValues.friend) : [...curUser.friends, newValues.friend]
    newValues = { ...newValues, friends: remain }
  }

  const options = {
    new: true, // return the modified document rather than the original.
    multi: true
  }

  User.findOneAndUpdate(conditions, { $set: newValues }, options, (err, updatedPost) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Cannot update existing user. Error is : ${err}`
      });
    } else {
      res.json({
        result: "ok",
        data: updatedPost,
        message: "Update user successfully"
      });
    }
  });
};


exports.get_stranger_users = async (req, res, next) => {
  try {
    const curUser = await User.findById(req.userData.userId).exec();
    const users = await User.find({ '_id': { $nin: [...curUser.friends, req.userData.userId] } }).limit(100).sort({ email: 1 }).select({ email: 1 }).exec()
    res.json({
      result: "ok",
      data: users,
      count: users.length,
      message: "Query list of users successfully"
    });
  } catch (error) {
    res.json({
      result: "failed",
      data: [],
      message: `Error is : ${error}`
    });
  }
};