var dbAgent = require('./dbAgent');
var Promise = require('promise');
var utils = require('./utils');
var request = require('request');
var usersStatusQueue = [];

module.exports.updateUserStatus = function (userID, familyMemberID, status) {
    return new Promise(function (resolve, reject) {
        var dbConnection = dbAgent.createDBConnection();
        var query = "UPDATE USER_SETTINGS SET USER_STATUS=? WHERE FAMILY_ID=? AND USER_ID=? ";

        dbConnection.query(query, [status, familyMemberID, userID], function (err, rows) {

            if (err) {
                console.log('ERROR!!! DB response is ' + rows);//debug
                console.log(err.message);
                dbConnection.end();
                resolve(false);
            } else {
                console.log('SUCCESS!!! updated user status');//debug
                dbConnection.end();
                resolve(true);
            }
        });
    });
};

module.exports.getAvailableUser = function (family_id, user_id) {
    return new Promise(function (resolve, reject) {
        dbAgent.getAvailableUsers(family_id, user_id).then(function (result, err) {
            console.log('utils.getAvailableUser.dbAgent.getAvailableUsers result is: ' + JSON.stringify(result));//debug liad
            if (err) {
                reject(err);
            } else  if (!result){
                resolve(0);//no results
            } else {
                console.log('SUCCESS!!');//debug liad
                var randomNumber = Math.floor(Math.random() * result.length);
                resolve (result[randomNumber]);
            }
        }).catch(function (rejectedRes) {
            console.log("Error getting available user: " + rejectedRes);
            reject(rejectedRes);
        });
    });
};

module.exports.setUserTimer = function (family_id, user_id) {
    var user = {
        familyID:family_id,
        userID:user_id
    };

    usersStatusQueue.push(user);
    setTimeout(setUserUnavailable, (1000 * 30 * 10), user_id, family_id);
};

module.exports.calcRelationshipRank = function (familyId, userID, familyMemberId, date) {
    return new Promise(function (resolve, reject) {
        dbAgent.getRelationshipStatus(familyId, userID, familyMemberId).then(function (currentRank) {
            console.log('======>> CURRENT RANK IS: ' + currentRank);//debug liad
            // var lastCallDate = relationshipResult.LAST_CALL;

            if (currentRank < 4) {
                resolve(currentRank + 1);
            } else {
                resolve(currentRank);
            }
            //TODO:continue implementation with last call and date
        }).catch(function (err) {

        });
    })
};

function setUserUnavailable(user_id, family_id) {
    for(var i = 0; i < usersStatusQueue.length; i++) {
        if (usersStatusQueue[i].userID === user_id && usersStatusQueue[i].familyID === family_id) {
            utils.updateUserStatus(user_id, family_id, 'false');
            usersStatusQueue.splice(i,1);
        }
    }
}

module.exports.updateFlowerState = function (val) {
    return new Promise(function (resolve, reject) {
        var url = 'http://blynk-cloud.com/14f620c6c7ac472e82f44bba939e5789/update/V0?value=' + val;
        request
            .get(url)
            .on('response', function(response) {
                console.log("======>>>>> BLYNK RESPONSE IS: ");//debug liad
                console.log(response.statusCode);//debug liad
                console.log(response.headers);//debug liad
                resolve(response);
            })
            .on('error', function (error) {
                console.log('BLYNK ERROR: ' + error);//debug liad
                reject(error);
            });
    });
};

module.exports.calcFlowerState = function (rank) {
    console.log('===>>POPO1: ' + rank);//debug liad
  var flowerStateArray = [0, 25, 50, 70];
  return flowerStateArray[rank - 1];
};