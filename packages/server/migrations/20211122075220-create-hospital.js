"use strict";

const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("hospitals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      significance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "auto-draft",
      },

      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("hospitals");
  },
};
