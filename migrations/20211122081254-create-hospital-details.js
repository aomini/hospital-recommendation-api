"use strict";
const migrationDefaultFields = require("../traits/database/migration-default-fields");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("HospitalDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      field_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "field_items",
          },
          key: "id",
        },
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "hospitals",
          },
          key: "id",
        },
      },
      value: {
        type: DataTypes.JSONB,
      },
      meta: {
        type: DataTypes.JSONB,
      },
      ...migrationDefaultFields(Sequelize),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("HospitalDetails");
  },
};
