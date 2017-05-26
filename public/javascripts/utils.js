var dbAgent = require('./dbAgent');
var Promise = require('promise');
var utils = require('./utils');
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
            console.log('utils.getAvailableUser.dbAgent.getAvailableUsers result is: ' + result);//debug liad
            if (err) {
                reject(err);
            } else  if (!result){
                resolve(0);//no results
            } else {
                console.log('SUCCESS!!');//debug liad
                var randomNumber = Math.floor(Math.random() * result.length);
                resolve (result[randomNumber]);
            }
        });
    });
};

module.exports.setUserTimer = function (family_id, user_id) {
    var user = {
        familyID:family_id,
        userID:user_id
    };

    usersStatusQueue.push(user);
    setTimeout(setUserUnavailable, (1000 * 60 * 10), user_id, family_id);
};

function setUserUnavailable(user_id, family_id) {
    for(var i = 0; i < usersStatusQueue.length; i++) {
        if (usersStatusQueue[i].userID === user_id && usersStatusQueue[i].familyID === family_id) {
            utils.updateUserStatus(user_id, family_id, 'false');
            usersStatusQueue.splice(i,1);
        }
    }
}