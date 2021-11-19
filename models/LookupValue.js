"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");

module.exports = (sequelize, DataTypes) => {
  class LookupValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Lookup);
    }
  }
  LookupValue.init(
    {
      label: DataTypes.STRING,
      value: DataTypes.STRING,
      lookup_id: DataTypes.INTEGER,
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      modelName: "LookupValue",
      tableName: "lookup_values",
      paranoid: true,
      underscored: true,
    }
  );
  return LookupValue;
};
