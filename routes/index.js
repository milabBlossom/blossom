var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = require('json-parser');
// var dbAgent = require('./public/javasctipts/dbAgent');
var Promise = require('promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    res.send('Hello World');
});

router.patch('/status', function (req, res, next) {
    updateUserStatus(req.body.userID, function (err, rows) {
        if(err){
          res.status(500);
          res.json({err: 'Error writing to DB'});
        } else {
          res.status(204);
        }
    });
});

router.get('/status', function (req, res, next) {
    getUsersStatus(function (err, rows) {
       if(err){
         res.status(500);
         res.json({err: 'error fetching data from DB'});
       } else {
         res.status(200);
         res.send(rows.toJSON());
       }
    });
});

function updateUserStatus(userID) {
    //TODO:implement
};

function getUsersStatus (userID) {
    //TODO:implement
};

module.exports = router;
