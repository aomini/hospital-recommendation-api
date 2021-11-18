const { User } = require("../../models");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");

module.exports.all = (req, res, next) => {
  return next(new ErrorHandler("some random error", 500));
};
