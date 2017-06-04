var Mongolass = require('mongolass');
var mongolass = require('./mongo').mongolass; //已经实例化的mongo

var Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  date: { type: 'date' },
  status: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});


exports.Post = Post;
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表