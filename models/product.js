'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.User, {through: models.Cart})
      Product.hasMany(models.Cart)
      Product.belongsToMany(models.User, {through: models.Love})
      Product.hasMany(models.Love)
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        customValidator(value) {
          if (value === '') {
            throw new Error('name harus diisi')
          }
        }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        customValidator(value) {
          if (value === '') {
            throw new Error('image_url harus diisi')
          }
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        customValidator(value) {
          let reg = new RegExp(/^[0-9]+$/)
          if (value === '') {
            throw new Error('price harus diisi')
          } else if(value < 0) {
            throw new Error('price tidak boleh negatif')
          } else if (!reg.test(value)) {
            throw new Error('price hanya boleh menggunakan angka')
          }
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        customValidator(value) {
          let reg = new RegExp(/^[0-9]+$/)
          if (value === '') {
            throw new Error('stock harus diisi')
          } else if(value < 0) {
            throw new Error('stock tidak boleh negatif')
          } else if (!reg.test(value)) {
            throw new Error('stock hanya boleh menggunakan angka')
          }
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      validate: {
        customValidator(value) {
          if (value === '') {
            throw new Error('category harus diisi')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};