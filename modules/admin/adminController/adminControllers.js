const response=require("./../../../services/responses");
const service=require("./../adminServices/adminServices");
const mysql=require("./../../../databases/mysql/mysql");

async function register(req, res) {
  try {
    const authenticatedEmail = await service.authenticateEmail({
      email: req.body.email,
    });
    if (authenticatedEmail && authenticatedEmail.length) {
      return response.sendCustomErrorResponse(
        res,
        400,
        "duplicate email"
      );
    }
    req.body.password = await service.encryptPassword(
      req.body.password
    );

    var transactionConnection = await mysql.getConnectionPromisified();

    await mysql.startTransactionPromisified(transactionConnection);

    const inserted = await service.insert(
      req.body,
      transactionConnection
    );
    return response.sendCustomSuccessResponse(
      res,
      {
        adminId: inserted.id,
      },
      200,
      "success"
    );
  } catch (error) {
    console.log("error_while_registration", error);
    if (transactionConnection) {
      await mysqlService.rollbackTransactionPromisified(transactionConnection);
    }
    return response.sendCustomErrorResponse(
      res,
      language,
      constants.responseCodes.SOMETHING_WENT_WRONG,
      constants.commonResponseMessages.SOMETHING_WENT_WRONG,
      {}
    );
  }
}


async function all(req, res) {
  try {
    let details=[];
    details=await service.getdetails({name:req.name});
    return response.sendCustomSuccessResponse(
      res,
      details,
      200,
      "success"
    );
   
  } catch (error) {
    console.log("error_while_registration", error);
    if (transactionConnection) {
      await mysqlService.rollbackTransactionPromisified(transactionConnection);
    }
    return response.sendCustomErrorResponse(
      res,
      language,
      constants.responseCodes.SOMETHING_WENT_WRONG,
      constants.commonResponseMessages.SOMETHING_WENT_WRONG,
      {}
    );
  }
}


async function login(req, res) {
  console.log("REQ_BODY_IN_LOGIN", {
    BODY: req.body,
    HEADERS: req.headers,
  });
  try {
    let loginDetails = await service.getdetails({ email: req.body.email});
    console.log("login_DETAILS=>", loginDetails);

    if (!loginDetails || !loginDetails.length) {
      return responses.sendCustomErrorResponse(
        res,
        400,
        "invalid email ID"
      );
    }
    console.log(loginDetails);

    const checkedPassword = await service.checkPassword(
      req.body.password,
      loginDetails[0].password
    );
    if (!checkedPassword) {
      return responses.sendCustomErrorResponse(
        res,
        400,
        "wrong message"
      );
    }
    const tokenData = {
      email: loginDetails[0].email,
    };

    loginDetails[0]["access-token"] = await response.createAccessToken(
      tokenData
    );
    return responses.sendCustomSuccessResponse(
      res,
      language,
      loginDetails[0]
    );

  } catch (error) {
    loggs.logError("error_while_admin_login", error);
    return responses.sendCustomErrorResponse(
      res,
      language,
      constants.responseCodes.COMMON_ERROR_CODE,
      constants.commonResponseMessages.LOGIN_FAILURE
    );
  }
}

async function forgotPassword(req, res) {
  try {
    var transactionConnection = await mysqlService.getConnectionPromisified();

    await mysqlService.startTransactionPromisified(transactionConnection);

    let customer = await service.getdetails({
        email: req.body.email,
      },
    );

    if (!customer || !customer.length) {
      return responses.sendCustomErrorResponse(
        res,
        400,
        "INVALID_EMAIL"
      );
    }

    customer = customer[0];

    let passwordResetToken = service.generateRandomString();

    await service.updateOtp(
      {
        passwordResetToken: passwordResetToken,
        id:customer.id,
      },
      transactionConnection
    );
    console.log("otp=>",passwordResetToken);
    await mysqlService.commitTransactionPromisified(transactionConnection);
    console.log("BEFORE_SUCCESS=>", customer);
    return responses.sendCustomSuccessResponse(res,{});
  } catch (error) {
    console.log("CUSTOMER_FROGOT_PASSWORD", error);
    if (transactionConnection) {
      await mysqlService.rollbackTransactionPromisified(transactionConnection);
    }
    return responses.sendCustomErrorResponse(
      res,
      400,
      error
    );
  }
}


async function reset(req,res){
  try{
    var transactionConnection = await mysqlService.getConnectionPromisified();

  await mysqlService.startTransactionPromisified(transactionConnection);

  let customer = await service.getdetails({
      email: req.body.email,
    },
  );
  if (!customer || !customer.length) {
    return responses.sendCustomErrorResponse(
      res,
      400,
      "INVALID_EMAIL"
    );
  }
  customer = customer[0];
  if(customer.otp!==req.body.otp)
  {
    return responses.sendCustomErrorResponse(
      res,
      400,
      "invalid otp entered"
    );
  }
  service.reset(
    {
    password:req.body.password,
    id:customer.id,
  },
    transactionConnection)
  return response.sendCustomSuccessResponse(res,{});
  }catch(error){
    console.log("CUSTOMER_FROGOT_PASSWORD", error);
    if (transactionConnection) {
      await mysqlService.rollbackTransactionPromisified(transactionConnection);
    }
    return responses.sendCustomErrorResponse(
      res,
      400,
      error
    );
  } 
}

module.exports={
  all,
  register,
  login,
  forgotPassword,
  reset
}
