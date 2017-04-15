var express = require('express');
var router = express.Router();

/*User operations*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.patch('/user', function (req, res, next) {
    //TODO:implement user update
});

router.post('/user', function (req, res, next) {
    //TODO:implement new user creation
});

router.delete('/user', function (req, res, next) {
    //TODO:implement user deletion
});

/*Family operations*/
router.patch('/family', function (req, res, next) {
    //TODO:implement user update
});

router.post('/family', function (req, res, next) {
    //TODO:implement new user creation
});

router.delete('/family', function (req, res, next) {
    //TODO:implement user deletion
});

function createID(){
    return Math.floor((Math.random() * 100000));
}

module.exports = router;
