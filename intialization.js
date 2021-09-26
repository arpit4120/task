const env = "dev";
const http = require("http");
const mysqlDb = require("./databases/mysql/mysql");
const mongo = require("./databases/mongo/mongo");
const logg = require("./services/logging");

async function initializeSerevrComponents() {
  try {
    
    connection = await mysqlDb.initializeMysqlConnection(
      {
        "mysql": {
          "host": "localhost",
          "user": "admin",
          "password": "admin",
          "database": "task",
          "multipleStatements": true
        }
      }
    );  

    // db = await mongo.initializeMongoConnection( config.get('dataBaseSettings.mongo'));
    // agenda = await mongo.intializeAgenda(config.get('dataBaseSettings.mongo'));
    // agendaService.scheduleRefreshTokenCron();
    await startHttpServer(3000);
    console.log("IN_APP.JS")
logg.log("PROCESS_ENV==>",{
  ENV_FILE : process.env
});
  } catch (error) {
    console.log("error while_intializing_server", error);
  }
};
function startHttpServer(port) {
  return new Promise((resolve, reject) => {
    var server = http.createServer(app);
    io = require('socket.io')(server);
    server.listen(port, function() {
      console.error(
        "###################### Express connected ##################",
        port
      );
      return resolve(server);
    });
  });
}

// os = server().then(server=>{
//   io = socketio(server);
//   // console.log(io)
// })
// console.log(io)
module.exports = {
  initializeSerevrComponents
};
