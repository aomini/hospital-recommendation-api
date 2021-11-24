const Joi = require("joi");
const { validateRequest } = require("..");

const UserRegisterRequest = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
    username: Joi.string().min(5).required(),
  });
  validateRequest(req.body, next, schema, res, false);
};
module.exports = UserRegisterRequest;
