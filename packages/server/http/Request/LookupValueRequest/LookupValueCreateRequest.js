const Joi = require("joi");
const { validateRequest } = require("..");

const LookupValueCreateRequest = (req, res, next) => {
  const schema = Joi.object({
    label: Joi.string().required("Label is required"),
    value: Joi.string().required("Value is required"),
  });
  validateRequest(req.body, next, schema, res, false);
};
module.exports = LookupValueCreateRequest;
