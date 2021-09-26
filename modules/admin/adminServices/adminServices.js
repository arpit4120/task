const mysql=require("./../../../databases/mysql/mysql");
const bcrypt=require("bcrypt");
const Promise = require("bluebird");
const Jwt = Promise.promisifyAll(require("jsonwebtoken"));

function authenticateEmail(obj) {
  try {
    let sql = `SELECT * FROM creds WHERE id IS NOT NULL`;
    let params = [];
    if (obj.email) {
      sql += ' AND email=?';
      params.push(obj.email)
    }
    return mysqlService.runMysqlQueryPromisified("CHECKING FOR DUPLICATES", sql, params);
  }
  catch (err) {
    throw err;
  }
}

function encryptPassword(password) {
  console.log("password===>", password);
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (
      error,
      hash
    ) {
      console.log("ENCRYPT_RESULT=>", { ERROR: error, RESULT: hash });
      if (error) return reject(error);
      return resolve(hash);
    });
  });
}


function insertAdmin(opts, transactionConnection) {
  try {
    const obj = {};
    opts.name ? (obj.name = opts.name) : 0;
    opts.email ? (obj.email = opts.email) : 0;
    opts.password ? (obj.password = opts.password) : 0;
    opts.phoneNo ? (obj.phoneNo = opts.phoneNo) : 0;
   
    const sql = "INSERT INTO creds SET ?  ";;
    return mysqlService.runMysqlQueryPromisified('INSERTING_ADMIN', sql, [obj], transactionConnection);

  } catch (error) {
  }
}

function getdetails(opts) {
  try {
    const sql = ` SELECT * FROM creds where 1 `
    if(opts.email)
    {
      sql=sql+`AND email= ?`
      obj=opts.email;
    }
    else if(opts.name)
    {
      sql=sql+`AND name= ?`;
      obj=opts.name;
    }
    return mysqlService.runMysqlQueryPromisified('details', sql,[obj]);
  } catch (error) {
    throw error;
  }
};

function checkPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, response) {
      console.log("CHECK_PASSWORD_RESULT==>", { ERROR: err, RESPONSE: response });
      if (err) return reject(err);

      return resolve(response);
    });
  });
}



async function createAccessToken(payload, time) {
  try {
    const expireTime = {
      expiresIn: time || constants.sessionData.EXPIRES_TIME
    };
    const token = await Jwt.signAsync(
      payload,
      constants.sessionData.JWT_SECREKT_KEY,
      expireTime
    );

    logging.log("JWT_TOKEN=>", token);
    return token;
  } catch (error) {
    throw error;
  }
};


function generateRandomString() {
  console.log("My passsssssss string", number);
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTYZ0123456789";
  let numberCount = 4;
  for (let i = 0; i < numberCount; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  console.log("text", text);
  return text;
}

function updateOtp(otps,transactionConnection){
  console.log("updateing the otp in database");
  const sql = ` UPDATE creds SET otp=? where id = ? `;
  return mysqlService.runMysqlQueryPromisified('details', sql,[otps.otp,otps.id],transactionConnection);

}

async function reset(otps,transactionConnection){
  console.log("requesting the for the password change");
  const sql=`UPDATE creds SET password=? where id = ? `;
  otps.password=await encryptPassword(otps.password);
  return mysqlService.runMysqlQueryPromisified('details', sql,[otps.password,otps.id],transactionConnection);
}

async function authenticateAccessToken(req, res, next) {
  try {
    req.headers["content-language"] = req.headers["content-language"];

    if (!req.headers["access-token"]) {
      // OPEN API USED FOR QUEST USER AND ENTERPRICE IS AUTHENTICATED
      return next();
    }


   
    const decodedData = await Jwt.verify(
      req.headers["access-token"],
      constants.sessionData.JWT_SECREKT_KEY
    );


    if (!decodedData.userType && (decodedData.userType != 0)) {
      return responses.sendCustomErrorResponse(
        res,
        "en",
        404,
        "AUTHENTICATION_ERROR"
      );
    };

    if (!decodedData.enterpriceReferenceId) {
      return responses.sendCustomErrorResponse(
        res,
        "en",
        404,
        "AUTHENTICATION_ERROR"
      );
    }

    next();
  } catch (error) {
    console.log("Error==>",error);
    logging.logError("ERROR_WHILE_AUTHENTICATEING=>", error);
    return responses.sendCustomErrorResponse(
      res,
      "en",
      404,
      "AUTHENTICATION_ERROR"
    );
  }
}


module.exports={
  authenticateAccessToken,
  reset,
  updateOtp,
  generateRandomString,
  createAccessToken,
  checkPassword,
  getdetails,
  insertAdmin,
  encryptPassword,
  authenticateEmail
}