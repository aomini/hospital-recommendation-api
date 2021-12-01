"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");
module.exports = (sequelize, DataTypes) => {
  class HospitalDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Priority, FieldItem }) {
      this.belongsTo(FieldItem);
      this.hasOne(Priority, {
        foreignKey: "field_item_id",
      });
      // define association here
    }
  }
  HospitalDetail.init(
    {
      field_item_id: DataTypes.INTEGER,
      hospital_id: DataTypes.INTEGER,
      value: {
        type: DataTypes.JSONB,
      },
      meta: {
        type: DataTypes.JSONB,
      },
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      tableName: "hospital_details",
      modelName: "HospitalDetail",
    }
  );
  return HospitalDetail;
};
