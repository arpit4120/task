const Joi = require("joi");

function validateRequest(request, joiSchema, res) {
  console.log("request",request);
  
  const validation = Joi.validate(request, joiSchema);
  if (validation.error) {
    const error =validation.error.details[0].message
    responses.parameterMissingError(
      res,
      400,
      error
    );
    return false;
  }
  return true;
};

function register(req, res, next) {
  console.log("ADDING_USER=>", { BODY: req.body, HEADER: req.headers });
  let schemaObject = {
    name: Joi.string().required(),
    phoneNo:Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  const schema = Joi.object().keys(schemaObject);

  let validate = validateRequest(req.body, schema, res);
  console.log("check=>", validate);

  if (validate) {
    next();
  }
};


function login(req, res, next) {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  });

  const validate =validateRequest(req.body, schema, res);
  console.log("validate", validate);

  if (validate) {
    return next();
  }
};

function forgotPassword(req, res, next) {
  console.log("CUSTOMER_FROGOT_PASSWORD=>", {
    BODY: req.query,
    HEADER: req.headers,
  });
  let schemaObject = {
    emailNo: Joi.string().required(),
  };

  const schema = Joi.object().keys(schemaObject);
  validate = validateRequest(req.body, schema, res);

  if (validate) {
    next();
  }
}

function reset(req,res,next){
  console.log("customer reset password=>",{
    body:req.body,
    header:req.headers
  });
  let schemaObject={
    email:Joi.string().required(),
    otp:Joi.number().required(),
    password:Joi.string().required()
  };
  const schema= Joi.object().keys(schemaObject);
  validate=validateRequest(req.body,schema,res);
  if(validate){
    next();
  }
}

function all(req,res,next){
  console.log("customer details=>",{
    body:req.body,
    header:req.headers
  });
  let schemaObject={
    name:Joi.string().optional(),
  };
  const schema= Joi.object().keys(schemaObject);
  validate=validateRequest(req.body,schema,res);
  if(validate){
    next();
  }
}



module.exports={
  all,
  reset,
  forgotPassword,
  login,
  register
}