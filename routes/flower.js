/**
 * Created by liadberko on 30/03/2017.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = require('json-parser');
// var dbAgent = require('./public/javasctipts/dbAgent');
var Promise = require('promise');


function calcFlowerStatus(targetUserID, flowerID) {
    return new Promise(function (resolve, reject) {
       if(true){//TODO:add validateNumInput parameters function to if condition

           var query = "SELECT * FROM CALLS_HYSTORY WHERE USER_ID=? AND FAMILY_MEMBER_ID=?";
           var dbConnection = createDBConnection();

           dbConnection.query(query, [targetUserID, flowerID], function (err, rows, fields) {
               if(err){
                   console.log(err.message);
                   reject(false);
               } else {
                   dbConnection.end();

                   var currentDate = Date.now();
                   var weights = DBDataToArray(rows); //array formation [last time there was a call (in days), duration of last (call in minutes), level of interest?]

                   console.log(rows);//debug

                   var result = Math.ceil((weights[0] - currentDate)/Math.abs((weights[0] - currentDate))) * (Math.abs((weights[0] - currentDate)) * 0.5 + weights[1] * 0.3 + weights[2] * 0.2);

                   resolve(result);
               }
           });
       }
    });
}

function DBDataToArray(rows) {
//TODO:implement
}

function createDBConnection() {
    var connection = mysql.createConnection({
        host: 'sql11.freemysqlhosting.net',
        user: 'sql11169126',
        password: 'nZCxGZ16u1',
        database: 'sql11169126',
        multipleStatements: true
    });

    connection.connect();
    return connection;
}