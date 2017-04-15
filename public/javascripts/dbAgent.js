/**
 * Created by liadberko on 30/03/2017.
 */

/**
 * Mysql Connection
 * Method does not handle errors
 * errors should be handled one each query request
 */

var dbAgent = function () {
    var connection = mysql.createConnection({
        host: 'sql11.freemysqlhosting.net',
        user: 'sql11169126',
        password: 'nZCxGZ16u1',
        database: 'sql11169126',
        multipleStatements: true
    });

    connection.connect();
    return connection;

};

module.exports = dbAgent;