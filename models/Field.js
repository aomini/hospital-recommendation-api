"use strict";
const { Model } = require("sequelize");
const modelDefaultFields = require("../traits/database/model-default-fields");

module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ FieldItem, Field }) {
      this.hasMany(FieldItem, {
        as: "field_items",
      });

      this.hasMany(Field, {
        foreignKey: "parent_id",
        as: "childrens",
      });
    }
  }
  Field.init(
    {
      parent_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ...modelDefaultFields(DataTypes),
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      tableName: "fields",
      modelName: "Field",
    }
  );
  return Field;
};
