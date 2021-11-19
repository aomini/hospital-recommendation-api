module.exports = (Sequelize) => ({
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
