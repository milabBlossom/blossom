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
        var query = 'SELECT USER_NAME,USER_PHONE_NUMBER FROM USER_SETTINGS WHERE FAMILY_ID=? AND NOT USER_ID=? AND USER_STATUS=true';
        var dbConnection = dbAgent.createDBConnection();

        dbConnection.query(query, [family_id, user_id], function (err, rows) {
            if (err) {
                console.log('ERROR!!! DB response is ' + rows);//debug
                console.log(err.message);
                reject (err);
            } else {
                dbConnection.end();
                console.log('SUCCESS!!! DB response is ' + rows);//debug
                resolve (rows);
            }
        });
    });
};

module.exports.updateRelationshipStatus = function (familyId, userID, familyMemberId, date, callLength, rank) {
    return new Promise(function (resolve, reject) {
        var query = 'UPDATE CALLS_HISTROY SET LAST_CALL=?,LAST_CALL_LENGTH=9 WHERE (USER_ID=? AND FAMILY_MEMBER_ID=?) OR (FAMILY_MEMBER_ID=? AND USER_ID=?);';
        var dbConnection = dbAgent.createDBConnection();
        console.log('userId2 is: ' + userID);//debug liad
        console.log('familyMemberId2 is: ' + familyMemberId);//debug liad
        date = 10;//debug liad

        dbConnection.query(query, [date, userID, familyMemberId, familyMemberId, userID], function (err) {
            if (err) {
                console.log('ERROR!!! DB response is ' + err.message);//debug
                reject (err);
            } else {
                dbConnection.end();
                console.log('SUCCESS updating calls history!!!');//debug
                resolve (true);
            }
        });
    });
};

module.exports.getRelationshipStatus = function (familyId, userId, familyMemberId) {
    console.log('====> HELLO1');//debug liad
    return new Promise(function (resolve, reject) {

    resolve(true);
    });
    //TODO:implement
};