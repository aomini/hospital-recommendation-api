"use strict";
const { Model } = require("sequelize");
const modelUserFields = require("../traits/database/model-user-fields");

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
      deleted_at: DataTypes.DATE,
      ...modelUserFields(DataTypes),
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
