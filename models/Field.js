"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Field.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      weight: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
      userc_id: DataTypes.INTEGER,
      userd_id: DataTypes.INTEGER,
      useru_id: DataTypes.INTEGER,
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      deleted_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      paranoid: true,
      tableName: "fields",
      modelName: "Field",
    }
  );
  return Field;
};
