const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {};

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  }
}, {
  sequelize,
  tableName: 'users',
  modelName: 'User',
  timestamps: true,
})

User.belongsToMany(User, { as: 'friends', through: 'user_friends', foreignKey: 'user_id', otherKey: 'friend_id' });

module.exports = User;
