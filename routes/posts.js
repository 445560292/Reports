var express = require('express');
var router = express.Router();
var _ = require('lodash');

var PostDao = require('../dao/postsDao');
var CommentDao = require('../dao/commentsDao');
var checkLogin = require('../middlewares/check').checkLogin;
var emailUtils = require('../utils/emailUtils');
var ejs = require('ejs');

router.get('/', function(req, res, next) {
  var author = req.query.author;

  PostDao.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      });
    })
    .catch(next);
});

router.get('/create', checkLogin, function(req, res, next) {
  res.render('create');
});

router.get('/report', checkLogin, function(req, res, next) {
  PostDao.getPostsByDate()
    .then(function (posts) {
      _.forEach(posts, function(post){

      emailUtils.sendEmails();


        console.log(post);
      });
      res.json({ success: true });
    })
    .catch(next);
});

router.post('/', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;
  var status = req.fields.status;
  console.log(status);
  try {
    if (!title.length) {
      throw new Error('请填写ticket号');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  var post = {
    author: author,
    title: title,
    status: status,
    content: content,
    date: new Date(),
    pv: 0
  };

  PostDao.create(post)
    .then(function (result) {
      post = result.ops[0];
      req.flash('success', '发表成功');
      res.redirect(`/posts/${post._id}`);
    })
    .catch(next);
});

router.get('/generate', function(req, res, next) {
     PostDao.getPostsByDate()
    .then(function (posts) {

      var inDev = [];
      var doneWitDev = [];
      var doneWithQA = [];
      var tomorrow = [];

      _.forEach(posts, function(post){
        if(post.status == "dev" && post.author.profession == "developer") {
          inDev.push(post);
        } else if(post.status == "done" && post.author.profession == "developer") {
          doneWitDev.push(post);
        } else  if (post.status == "tomorrow"){
          tomorrow.push(post);
        } else {
          doneWithQA.push(post);
        }
      });
      console.log({inDev: inDev, doneWitDev: doneWitDev, doneWithQA: doneWithQA});
      res.render("report", {inDev: inDev, doneWitDev: doneWitDev, doneWithQA: doneWithQA, tomorrow: tomorrow});
    })
    .catch(next);

   
});

router.get('/:postId', function(req, res, next) {
  var postId = req.params.postId;
  
  Promise.all([
    PostDao.getPostById(postId),
    CommentDao.getComments(postId),
    PostDao.incPv(postId)
  ])
  .then(function (result) {
    var post = result[0];
    var comments = result[1];
    if (!post) {
      throw new Error('该文章不存在');
    }

    res.render('post', {
      post: post,
      comments: comments
    });
  })
  .catch(next);
});

router.get('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostDao.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', {
        post: post
      });
    })
    .catch(next);
});

router.post('/:postId/edit', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;
  var title = req.fields.title;
  var content = req.fields.content;

  PostDao.updatePostById(postId, author, { title: title, content: content })
    .then(function () {
      req.flash('success', '编辑文章成功');
      res.redirect(`/posts/${postId}`);
    })
    .catch(next);
});

router.get('/:postId/remove', checkLogin, function(req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user._id;

  PostDao.delPostById(postId, author)
    .then(function () {
      req.flash('success', '删除文章成功');
      res.redirect('/posts');
    })
    .catch(next);
});
router.post('/:postId/comment', checkLogin, function(req, res, next) {
  var author = req.session.user._id;
  var postId = req.params.postId;
  var content = req.fields.content;
  var comment = {
    author: author,
    postId: postId,
    content: content
  };

  CommentDao.create(comment)
    .then(function () {
      req.flash('success', '留言成功');
      res.redirect('back');
    })
    .catch(next);
});
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentDao.delCommentById(commentId, author)
    .then(function () {
      req.flash('success', '删除留言成功');
      res.redirect('back');
    })
    .catch(next);
});

module.exports = router;
