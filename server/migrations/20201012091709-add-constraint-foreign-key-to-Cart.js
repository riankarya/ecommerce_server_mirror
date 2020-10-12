'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint("Carts", {
        fields: ["UserId"],
        type: "foreign key",
        name: "custom_fkey_UserId",
        references: { //Required field
          table: "Users",
          field: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }),
      queryInterface.addConstraint("Carts", {
        fields: ["ProductId"],
        type: "foreign key",
        name: "custom_fkey_ProductId",
        references: { //Required field
          table: "Products",
          field: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint("Carts", "UserId"),
      queryInterface.removeConstraint("Carts", "ProductId")
    ])
  }
};
