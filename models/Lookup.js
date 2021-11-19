"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lookup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ LookupValue }) {
      // define association here
      this.hasMany(LookupValue);
    }
  }
  Lookup.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Lookup",
      paranoid: true,
      underscored: true,
      tableName: "lookups",
    }
  );
  return Lookup;
};
