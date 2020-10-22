'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Carts', 'quantity', {type: Sequelize.INTEGER}),
      queryInterface.addColumn('Carts', 'status', {type: Sequelize.BOOLEAN})
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Carts', 'quantity'),
      queryInterface.removeColumn('Carts', 'status')
    ])
  }
};
