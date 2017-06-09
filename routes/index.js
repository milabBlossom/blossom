var express = require('express');
var router = express.Router();
var dbAgent = require('../public/javascripts/dbAgent');
var utils = require('../public/javascripts/utils');
var request = require('request');


/* GET service health check */
router.get('/', function(req, res, next) {//FOR DEBUGGING
    console.log('got a get request:\n');
    var db = dbAgent.createDBConnection();
    var query = "SELECT * FROM USER_SETTINGS;";
    return db.query(query, function (err, rows) {
        db.end();
        if(err || !rows){
            res.status(500).json({service_health: "DOWN"});
        } else {
            res.status(200).json({service_health: "UP"});
        }
    });
});

router.get('/flower', function (req, res, next) {
    var val = req.query.value;
    return utils.updateFlowerState(val);
});

router.post('/', function (req, res, next) {
   var userID = req.body.user_id;
   var familyID = req.body.family_id;
   console.log('I got a post request');
   console.log(userID);
   console.log(familyID);

    utils.updateUserStatus(userID,familyID, true).then(function (response) {
        console.log('==> response is: ' + response);//debug liad
        if(!response){
            res.status(500);
            res.json({err: 'Error updating user status in DB'});
        } else {
            utils.setUserTimer(familyID, userID);
            utils.getAvailableUser(familyID, userID).then(function (result) {
                console.log('==> result is: ' + JSON.stringify(result));//debug liad
                if(!result){
                    console.log('ERROR!! at index.post root : ' + result);//debug liad
                    res.status(404)
                        .json({
                            contact_name: 'No results',
                            contact_phone_number: 'No results'
                        });
                } else {
                    res.status(200).json({
                        contact_name: result.USER_NAME,
                        contact_phone_number: result.USER_PHONE_NUMBER,
                        contact_user_id: result.USER_ID,
                        contact_family_id: result.FAMILY_ID
                    });
                }
            }).catch(function (err) {
                console.log('Error getting available user: ' + err);
            })
        }
    });
});

router.put('/', function (req, res, next) {
   var userID = req.body.user_id;
   var familyMemberId = req.body.family_member_id;
   var familyId = req.body.family_id;
   var date = Date().now();
   var callLength = 10;//temporary value until we figure out how to pass call length as variable

    utils.calcRelationshipRank(familyId, userID, familyMemberId, date).then(function (rank) {
        dbAgent.updateRelationshipStatus(familyId, userID, familyMemberId, date, callLength, rank);
        var flowerState = utils.calcFlowerState(rank);
        utils.updateFlowerState(flowerState);
        res.status(204).send();
    }).catch(function (err) {
        console.log("Error updating calls history at router");
        res.status(500)
            .json({
               status_code: 500,
                message: "Error updating calls history at router",
                error: err
            });
    });

});

// router.patch('/status', function (req, res, next) {
//     utils.updateUserStatus(req.body.userID,req.body.familyMemberID,  function (err) {
//         if(err){
//           res.status(500);
//           res.json({err: 'Error writing to DB'});
//         } else {
//             //TODO:return all available family members if update is for 'available' status
//           res.status(204);
//         }
//     });
// });

// router.get('/status/:userID/:familyMemberID', function (req, res, next) {
//     getUsersStatus(req.params.userID, req.params.familyMemberID, function (val) {
//        if(!val){
//            console.log("Get user status handler(error): " + req.params.id);//liad debug
//          res.status(500);
//          res.json({err: 'error fetching data from DB'});
//        } else if(val === -1) {
//             res.status(404);
//             res.json({Error: "User not found, please validate ID"});
//        } else {
//            console.log("Get user status handler(success): " + req.params.id);//liad debug
//          res.status(200);
//          res.json({Value:val});
//        }
//     });
// });
//
//
//
// function getUsersStatus (userID, familyMemberID) {
//     var db = dbAgent.createDBConnection();
//     var query = "SELECT * FROM CONNECTION_HISTORY WHERE user_id=? and family_member_id=?;";
//     return db.query(query, [userID, familyMemberID], function (err, rows) {
//         db.end();
//         if(err){
//             return 0;
//         } else if(!rows) {
//             return -1;
//         } else {
//             return rows[0];
//         }
//     });
// };

// function createDBConnection() {
//     var connection = mysql.createConnection({
//         host: 'sql11.freemysqlhosting.net',
//         user: 'sql11169126',
//         password: 'nZCxGZ16u1',
//         database: 'sql11169126',
//         multipleStatements: true
//     });
//
//     connection.connect();
//     return connection;
// }

module.exports = router;
