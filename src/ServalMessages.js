const ServalGET = require('./ServalGETMessages');
const ServalPOST = require('./ServalPOSTMessages');
const Util = require('util');
const fs = require('fs');
const Manifest = require('./ServalManifestBuilders');

function showResponse(responseBody) {

    // Receive/handle response
    console.log("******************************************************************************************************");
    console.log("Inserted:");
    console.log(Util.inspect(responseBody));
    console.log("******************************************************************************************************");
}

// gets mySID, builds default manifest, puts everything together and "restful/rhizome/insert"s it
function insertDefaultRhizomeBundleWith(manifestExtension, payload) {
    let manifestAppendix;
    if (manifestExtension === "" || manifestExtension === false || manifestExtension === undefined || !manifestExtension){
        manifestAppendix = Manifest.buildDefaultManifestExtension();
    } else {
        manifestAppendix = manifestExtension;
    }

    ServalGET.getMyKeyRingIdentity().then(function (myKeyRing) {
        ServalPOST.sendRhizomeInsertPostMessage(myKeyRing.identity.sid, manifestAppendix, payload, showResponse);
    })
}

function insertFileRhizomeBundle(msg) {
    let manifestExtension = Manifest.buildInsertFileManifestFor(msg);

    fs.readFile(msg.path + msg.filename, null, (buffer) => {
        insertDefaultRhizomeBundleWith(manifestExtension, buffer);
    });
}
function updateFileRhizomeBundle(msg) {
    // let msg = ComCenterMsg.EmptyIncomingRosPhotoMessage; // FYI
    let manifestExtension = Manifest.buildUpdateFileManifestFor(msg);

    fs.readFile(msg.path + msg.filename, null, (buffer) => {
        insertDefaultRhizomeBundleWith(manifestExtension, buffer);
    });
}


module.exports.insertFileRhizomeBundle = insertFileRhizomeBundle;
module.exports.updateFileRhizomeBundle = updateFileRhizomeBundle;
module.exports.insertDefaultRhizomeBundleWith = insertDefaultRhizomeBundleWith;

module.exports.getBundle= ServalGET.getBundle;
module.exports.simplifiedGetVeryLatestBundleID = ServalGET.simplifiedGetVeryLatestBundleID;
