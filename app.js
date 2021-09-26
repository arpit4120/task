
console.log("APPLICATION_ROOT=>", __dirname);

const bodyParser = require("body-parser");
const express = require("express");
app = express();
const env = "dev";
const cors = require("cors");
const intialization = require("./intialization");
const logg = require("./services/logging");
const adminRoutes = require('./modules/admin/index')

// const whiteLabelRoutes = require("./modules/whitelabel/index");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

// if (process.env.NODE_ENV === "dev") {
//   swaggerDocument.host = "api.moskenes.io";
// } else {
//   swaggerDocument.host = "localhost:3000";
// }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", (req, res, next) => {
  logg.log("API_CALLED=>", {
    PATH: req.path,
    BODY: req.body,
    QUERY: req.query,
  });
  next();
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/admin", adminRoutes);
// app.use('/api/whiteLabel',whiteLabelRoutes)
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.sendFile("client/index.html", { root: __dirname });
});

intialization.initializeSerevrComponents();

