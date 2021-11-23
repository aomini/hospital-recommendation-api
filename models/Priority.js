"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Priority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Priority.init(
    {
      field_item_id: DataTypes.INTEGER,
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      tableName: "priorities",
      modelName: "Priority",
    }
  );
  return Priority;
};
