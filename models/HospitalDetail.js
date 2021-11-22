"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HospitalDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ FieldItem }) {
      this.belongsTo(FieldItem);
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
