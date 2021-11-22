"use strict";

const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fields", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      parent_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "fields",
          },
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        unique: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fields");
  },
};
