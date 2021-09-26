const mysql = require("mysql");
const logg = require("./../../services/logging");

function initializeMysqlConnection(dbConfig) {
  return new Promise((resolve, reject) => {
    let noOfConnections = 0;
    let conn = mysql.createPool(dbConfig);
    conn.on("connection", function(connection) {
      console.log("in on connection");
      noOfConnections++;
      console.log("NUMBER OF CONNECTION IN POOL : ", noOfConnections);
    });

    return resolve(conn);
  });
}

async function getConnectionPromisified() {
  return new Promise((resolve, reject) => {
    connection.getConnection(function(err, newConnection) {
      console.log("in_get_connection", err);
      if (err) {
        newConnection.release();
        return reject(err);
      }
      return resolve(newConnection);
    });
  });
}

function runTransactionPromsified(event ,sql, params, transactionConnection) {
  return new Promise((resolve, reject) => {
    const query = transactionConnection.query(sql, params, function(
      error,
      result
    ) {
      logg.log(event || "TRANSACTIONN_QUERY_RESULT", {
        ERROR: error,
        RESULT: result,
        SQL: query.sql
      });
      if (error) {
        rollbackTransactionPromisified(transactionConnection)
          .then(() => {
            return reject({});
          })
          .catch(error => {
            logg.logError(event || "ERROR_WHILE_ROLLING_BACK-->", error);
            return reject(error);
          });
      } else {
        return resolve(result);
      }
    });
  });
}

function startTransactionPromisified(transactionConnection) {
  return new Promise((resolve, reject) => {
    transactionConnection.beginTransaction(function(error) {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

function commitTransactionPromisified(transactionConnection) {
  return new Promise((resolve, reject) => {
    transactionConnection.commit(function(error) {
      logg.log("TRANSACTIONN_QUERY_RESULT", { ERROR: error });
      if (error) {
        rollbackTransactionPromisified(transactionConnection)
          .then(() => {
            return reject();
          })
          .catch(error => {
            logg.logError("ERROR_WHILE_COMMTTING_TANSATION=>", error);
            return reject();
          });
      } else {
        logg.log("TRANSACTION_RELEASED")
        transactionConnection.release();
        return resolve();
      }
    });
  });
}

function rollbackTransactionPromisified(transactionConnection) {
  return new Promise((resolve, reject) => {
    try {
      if (!transactionConnection) {
        return reject("error");
      }
      transactionConnection.rollback(function(error) {
        logg.log("ROLL_BACK_RESULT", error);
        if (connection._freeConnections.indexOf(transactionConnection) === -1) {
          transactionConnection.release();
        }
        return resolve();
      });
    } catch (error) {
      logg.logError("ERROR_WHILE_ROLLING_BACK", error);
      return reject(error);
    }
  });
}

function runMysqlQueryPromisified(event, sql, params, transactionConnection) {
  return new Promise((resolve, reject) => {
    if (transactionConnection) {
      const query = transactionConnection.query(
        sql,
        params,
        (error, result) => {
          logg.log("EXECUTING_QUERY" + event, {
            ERROR: error,
            RESULT: result,
            SQL: query.sql,
            RESULT: result
          });
          if (error) return reject(error);
          else return resolve(result);
        }
      );
    } else {
      const query = connection.query(sql, params, (error, result) => {
        logg.log("EXECUTING_QUERY_" + event, {
          ERROR: error,
          RESULT: result,
          SQL: query.sql,
          RESULT: result
        });
        if (error) return reject(error);
        else return resolve(result);
      });
    }
  });
}

module.exports = {
  initializeMysqlConnection,
  rollbackTransactionPromisified,
  startTransactionPromisified,
  runTransactionPromsified,
  commitTransactionPromisified,
  getConnectionPromisified,
  runMysqlQueryPromisified
};
