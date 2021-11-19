const Joi = require("joi");

/** Schema for uuid verification */
module.exports.guid = Joi.string()
  .guid({
    version: ["uuidv4"],
  })
  .messages({
    "string.guid": "{{#label}} is invalid",
  });

/** Schema validator that validates data against schema */
module.exports.validateRequest = (
  data,
  next,
  schema,
  res,
  abortEarly = false
) => {
  // schema options
  const options = {
    abortEarly, // include all errors
  };

  const { error } = schema.validate(data, options);
  console.log(error);

  if (error) {
    const { details } = error;
    res.status(422).send(formatError(details));
  } else {
    next();
  }
};

const formatError = (errorsDetails) => {
  return errorsDetails.reduce((acc, iterator) => {
    const { message, context } = iterator;
    acc[context.label] = message;
    return acc;
  }, {});
};
