"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");

module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Point.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      lat: { type: DataTypes.STRING, allowNull: false },
      lng: { type: DataTypes.STRING, allowNull: false },
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      underscored: true,
      modelName: "Point",
      tableName: "points",
    }
  );
  return Point;
};
