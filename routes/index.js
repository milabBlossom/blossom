var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = require('json-parser');
// var dbAgent = require('./public/javasctipts/dbAgent');
var Promise = require('promise');
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  //   res.status(200);
    console.log('got a get request:\n');
    var test = [0, 1, 2, 3, 4, 5, 6];
    res.json({
        userID:123456,
        flowerValue: 5
    });
});

router.post('/', function (req, res, next) {
   var userID = req.body.user_id;
   var familyID = req.body.family_id;
   console.log('I got a post request');
   console.log(userID);
   console.log(familyID);
   res.status(200);
   res.json({
       contact: "0544589610"
   })
});

router.patch('/status', function (req, res, next) {
    updateUserStatus(req.body.userID,req.body.familyMemberID,  function (err) {
        if(err){
          res.status(500);
          res.json({err: 'Error writing to DB'});
        } else {
            //TODO:return all available family members if update is for 'available' status
          res.status(204);
        }
    });
});

router.get('/status/:userID/:familyMemberID', function (req, res, next) {
    getUsersStatus(req.params.userID, req.params.familyMemberID, function (val) {
       if(!val){
           console.log("Get user status handler(error): " + req.params.id);//liad debug
         res.status(500);
         res.json({err: 'error fetching data from DB'});
       } else if(val === -1) {
            res.status(404);
            res.json({Error: "User not found, please validate ID"});
       } else {
           console.log("Get user status handler(success): " + req.params.id);//liad debug
         res.status(200);
         res.json({Value:val});
       }
    });
});

function updateUserStatus(userID, familyMemberID) {
    //TODO:use flower.js functions to calculate new status
};

function getUsersStatus (userID, familyMemberID) {
    //TODO:implement
    var db = createDBConnection();
    var query = "SELECT * FROM CONNECTION_HISTORY WHERE user_id=? and family_member_id=?;";
    return db.query(query, [userID, familyMemberID], function (err, rows) {
        if(err){
            return 0;
        } else if(!rows) {
            return -1;
        } else {
            return rows[0];
        }
    });
};

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

module.exports = router;
