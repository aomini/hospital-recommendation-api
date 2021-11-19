"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fields", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        unique: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
            // schema: "schema",
          },
          key: "id",
        },
      },
      useru_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "users",
            // schema: "schema",
          },
          key: "id",
        },
      },
      userd_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "users",
            // schema: "schema",
          },
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fields");
  },
};
