/**
 * Created by liadberko on 30/03/2017.
 */
var mysql = require('mysql');
var Promise = require('promise');
var dbAgent = require('./dbAgent');
/**
 * Mysql Connection
 * Method does not handle errors
 * errors should be handled one each query request
 */

module.exports.createDBConnection = function () {
    var connection = mysql.createConnection({
        host: 'sql11.freemysqlhosting.net',
        user: 'sql11176601',
        password: 'xaYaikVj2s',
        database: 'sql11176601',
        multipleStatements: true
    });

    connection.connect();
    return connection;

};

module.exports.getAvailableUsers = function (family_id, user_id) {
    return new Promise(function (resolve, reject) {
        console.log('popo1');//debug liad
        var query = 'SELECT USER_PHONE_NUMBER FROM USER_SETTINGS WHERE FAMILY_ID=? AND NOT USER_ID=? AND USER_STATUS=true';
        var dbConnection = dbAgent.createDBConnection();

        dbConnection.query(query, [family_id, user_id], function (err, rows) {
            if (err) {
                console.log('ERROR!!! DB response is ' + rows);//debug
                console.log(err.message);
                resolve (0);
            } else {
                dbConnection.end();
                console.log('SUCCESS!!! DB response is ' + rows);//debug
                resolve (rows);
            }
        });
    });
};