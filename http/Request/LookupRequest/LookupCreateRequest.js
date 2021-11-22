const Joi = require("joi");
const { validateRequest } = require("..");

const LookupCreateRequest = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
  });
  validateRequest(req.body, next, schema, res, false);
};
module.exports = LookupCreateRequest;
