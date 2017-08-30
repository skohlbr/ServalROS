const ServalGET = require('./ServalGETMessages');
const ServalPOST = require('./ServalPOSTMessages');
const Util = require('util');

function showResponse(responseBody) {

    // Receive/handle response
    console.log("******************************************************************************************************");
    console.log("Inserted:");
    console.log(Util.inspect(responseBody));
    console.log("******************************************************************************************************");
}

// gets mySID, builds default manifest, puts everything together and "restful/rhizome/insert"s it
function insertDefaultRhizomeBundleWith(payload) {
    ServalGET.getMyKeyRingIdentity().then(function (myKeyRing) {
        // console.log("Retrieved myKeyRing: " + Util.inspect(myKeyRing));
        // console.log("Now trying to send POST message");

        ServalPOST.sendRhizomeInsertPostMessage(myKeyRing.identity.sid, payload, showResponse);
    })
}

/*
return new Promise(
    function (fulfill, reject) {


    }
);
*/

function updateFileRhizomeBundle(msg) {
    console.log("Dummy for updating received message: " + Util.inspect(msg));
}

module.exports.updateFileRhizomeBundle = updateFileRhizomeBundle;
module.exports.insertDefaultRhizomeBundleWith = insertDefaultRhizomeBundleWith;

module.exports.getBundle= ServalGET.getBundle;
module.exports.simplifiedGetVeryLatestBundleID = ServalGET.simplifiedGetVeryLatestBundleID;
