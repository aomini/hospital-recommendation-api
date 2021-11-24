"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");

module.exports = (sequelize, DataTypes) => {
  class Hospital extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ HospitalDetail }) {
      this.hasMany(HospitalDetail);
    }
  }
  Hospital.init(
    {
      significance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "auto-draft",
      },
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      tableName: "hospitals",
      modelName: "Hospital",
    }
  );
  return Hospital;
};
