const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

class UserFriends extends Model {}

UserFriends.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    friend_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    since: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'UserFriends',
    tableName: 'user_friends',
    timestamps: false,
    primaryKey: false,
  }
);

UserFriends.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserFriends.belongsTo(User, { foreignKey: 'friend_id', as: 'friend' });

module.exports = UserFriends;
