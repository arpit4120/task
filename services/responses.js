const logg = require("./logging");

function sendCustomSuccessResponse(resp, language, data, code, message) {
  const response = {
    statusCode: code || 200,
    message:"success",
    data: data || {},
  };
  resp.type("json");
  return resp.send(JSON.stringify(response));
}

function updatesSuccess(resp, language, data, code, message) {
  const response = {
    statusCode: code || 200,
    message:"updated",
    data: data || {},
  };
  resp.type("json");
  return resp.send(JSON.stringify(response));
}

function sendCustomErrorResponse(resp, language, code, message, data) {
  logg.log("IN_SEND_ERROR=>", message);
  logg.log("messages_lang=>", language);
  logg.log("the_message=>", messages[language][message]);
  const response = {
    statusCode: code || 400,
    message:"commonResponseMessages.SOMETHING_WENT_WRONG",
    data: data || {},
  };

  resp.statusCode = code || 400;
  resp.type("json");

  return resp.send(JSON.stringify(response));
}
function parameterMissingError(resp, language, code, message, data) {
  const response = {
    statusCode: code || 400,
    message:"SOMETHING_WENT_WRONG",
    data: data || {},
  };
  resp.statusCode = code || 400;
  resp.type("json");
  return resp.send(JSON.stringify(response));
}

module.exports = {
  sendCustomErrorResponse,
  sendCustomSuccessResponse,
  parameterMissingError,
  updatesSuccess,
};
