"use strict";

const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lookup_values", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING,
      },
      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lookup_values");
  },
};
