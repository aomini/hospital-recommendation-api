const Joi = require("joi");
const { validateRequest } = require("..");

const PriorityUpdateRequest = (req, res, next) => {
  const schema = Joi.object({
    weight: Joi.number().required(),
  });
  validateRequest(req.body, next, schema, res, false);
};
module.exports = PriorityUpdateRequest;
