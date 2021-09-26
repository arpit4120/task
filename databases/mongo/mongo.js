const MongoClient = require("mongodb").MongoClient;
const Agenda = require("agenda");

const logg = require("./../../services/logging");

function initializeMongoConnection(dbConfig) {
  return new Promise((resolve, reject) => {
    
    let mongoURL = `mongodb://${dbConfig.mongoUser}:${dbConfig.mongoPassword}@${dbConfig.mongoHost}:27017/${dbConfig.databaseName}`;
    logg.log("MONGO_URL=>", mongoURL);
    MongoClient.connect(
      mongoURL,
      { poolSize: 20, useUnifiedTopology: true },
      function(err, database) {
        if (err) {
          console.error("Mongo connection error", err);
          return reject(err);
        }
        console.error(
          " ##########################################MONGO CONNECTED=>"
        );
        return resolve(database);
      }
    );
  });
}

function intializeAgenda(dbConfig) {
  return new Promise((resolve, reject) => {
    let mongoURL = `mongodb://${dbConfig.mongoUser}:${dbConfig.mongoPassword}@${dbConfig.mongoHost}:27017/${dbConfig.databaseName}`;
    const agenda = new Agenda({ db: { address: mongoURL } });
    return resolve(agenda);
  });
}

function deleteData(collection, criteria) {
  logg.log("DATA_BEFORE_DELETE=>", { collection, criteria });
  return new Promise((resolve, reject) => {
    db.collection(collection).remove(criteria, function(error, result) {
      logg.log("DELETE_RESULT=>", { ERROR: error, RESULT: result });
      return resolve({});
    });
  });
}

function getData(collection, criteria) {
  return new Promise((resolve, reject) => {
    const cursor = db.collection(collection).find(criteria || {});
    if (cursor) {
      cursor.toArray(function(err, result) {
        cursor.close();
        logg.log("GET_DATA=>", { ERROR: err, RESULT: result });
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    } else {
      logg.log("INVALID_QUERY");
      return reject({});
    }
  });
}

function updateData(collection, criteria, setObj) {
  return new Promise((resolve, reject) => {
    db.collection(collection).update(criteria, { $set: setObj }, function(
      error,
      result
    ) {
      logg.log("UPDATE_DATA=>", { ERROR: error, RESULT: result });
      if (error) {
        logg.log("IN_UDPDATE_MONGO_ERROR");
        return resolve(false);
      } else return resolve(true);
    });
  });
}

module.exports = {
  initializeMongoConnection,
  intializeAgenda,
  deleteData,
  getData,
  updateData
};
