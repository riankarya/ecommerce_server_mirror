'use strict';
const {
  Model
} = require('sequelize');
const hashPassword = require('../helpers/hashPassword')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Product, {through: models.Cart})
      User.hasMany(models.Cart)
      User.belongsToMany(models.Product, {through: models.Love})
      User.hasMany(models.Love)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        customValidator(value) {
          let reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          if (value === '') {
            throw new Error('Email harus diisi')
          } else if (!reg.test(String(value).toLowerCase())) {
            throw new Error('Format Email salah')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        customValidator(value) {
          let reg = new RegExp(/^[a-zA-Z0-9]+$/)
          if (value === '') {
            throw new Error('Password harus diisi')
          } else if (!reg.test(value)) {
            throw new Error('Password hanya boleh menggunakan huruf dan angka')
          }
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        user.password = hashPassword(user.password)
        if (user.role == null) {
          user.role = "customer"
        }
      }
    }
  });
  return User;
};