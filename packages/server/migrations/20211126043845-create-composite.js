"use strict";

const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Composites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hospital_id: {
        type: Sequelize.INTEGER,
      },
      field_id: {
        type: Sequelize.INTEGER,
      },
      values: {
        type: Sequelize.ARRAY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Composites");
  },
};
