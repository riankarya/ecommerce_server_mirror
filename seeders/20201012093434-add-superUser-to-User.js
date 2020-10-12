'use strict';
const hashPassword = require('../helpers/hashPassword')
const admin = require('../files/superUser.json')
admin.forEach(elem => {
  elem.password = hashPassword(elem.password)
  elem.createdAt = new Date()
  elem.updatedAt = new Date()
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', admin, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
