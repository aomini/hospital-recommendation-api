"use strict";
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne({
      where: { username: "rootuser" },
    });
    if (user) return;
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync("Password@1", salt);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "root",
          last_name: "root",
          username: "rootuser",
          password: hashedpassword,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await User.destroy({
      where: {
        username: "rootuser",
      },
    });
  },
};
