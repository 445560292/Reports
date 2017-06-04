var Mongolass = require('mongolass');
var mongolass = require('./mongo').mongolass; //已经实例化的mongo

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  profession: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' }
});
exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一