var User = require('../models/user').User;

module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  },

  // 通过用户名获取用户信息
  getUserByName: function getUserByName(name) {
    return User
      .findOne({ name: name })
      .addCreatedAt()
      .exec();
  },

  getUsers: function getUsers() {
    return User
      .find()
      .addCreatedAt()
      .exec();
  }

};
