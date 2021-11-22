"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");
module.exports = (sequelize, DataTypes) => {
  class FieldItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FieldItem.init(
    {
      field_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      order: {
        type: DataTypes.INTEGER,
      },
      meta: DataTypes.JSONB,
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      tableName: "field_items",
      modelName: "FieldItem",
    }
  );
  return FieldItem;
};
