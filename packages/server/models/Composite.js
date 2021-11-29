"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");

module.exports = (sequelize, DataTypes) => {
  class Composite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {}
  }
  Composite.init(
    {
      hospital_id: DataTypes.INTEGER,
      field_id: DataTypes.INTEGER,
      values: DataTypes.ARRAY(DataTypes.JSONB),
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      underscored: true,
      tableName: "composites",
      modelName: "Composite",
    }
  );
  return Composite;
};
