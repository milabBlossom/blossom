/**
 * Created by liadberko on 30/03/2017.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = require('json-parser');
var dbAgent = require('../public/javascripts/dbAgent');
var Promise = require('promise');
var mysql = require('mysql');


router.get('/', function(req, res, next) {
    // var val = req.query.value;
    // var url = 'http://blynk-cloud.com/14f620c6c7ac472e82f44bba939e5789/update/V0?value=' + val;
    //
    // request
    //     .get(url)
    //     .on('response', function(response) {
    //         console.log(response.statusCode);
    //         console.log(response.headers);
    //     })
});

function calcFlowerStatus(targetUserID, flowerID) {
    return new Promise(function (resolve, reject) {
       if(true){//TODO:add validateNumInput parameters function to if condition

           var query = "SELECT * FROM CALLS_HYSTORY WHERE USER_ID=? AND FAMILY_MEMBER_ID=?";
           var dbConnection = dbAgent.createDBConnection();

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