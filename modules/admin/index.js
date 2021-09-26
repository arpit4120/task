const express = require("express");
const router = express.Router();

const validator=require("./adminValidator/adminValidator");
const controller=require("./adminController/adminControllers");
const service=require("./adminServices/adminServices");


router.post("/register",
validator.register,
controller.register);

router.post("/login",
validator.login,
controller.login);

// router.put("forgetPassword",
// validator.forgetPassword,
// controller.forgetPassword)

router.put("/resetPassword",
validator.reset,
controller.reset);



router.get("/getAll",
validator.all,
service.authenticateAccessToken,
controller.all)


module.exports = router;
