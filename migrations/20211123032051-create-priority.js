"use strict";

const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Priorities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      field_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "field_items",
          },
          key: "id",
        },
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Priorities");
  },
};
