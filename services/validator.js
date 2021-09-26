const Joi = require("joi");
const responses = require("./responses");

function validateRequest(request, joiSchema, res, language) {
  console.log("request",request);
  
  const validation = Joi.validate(request, joiSchema);
  if (validation.error) {
    const error =
      validation.error.details && validation.error.details.length
        ? validation.error.details[0].message:"error";
    responses.parameterMissingError(
      res,
      language,
      "error",
      error
    );
    return false;
  }
  return true;
};


module.exports = {
  validateRequest ,
};
