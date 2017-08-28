const ServalGET = require('./GetRhizomeMessage');
const ServalPOST = require('./PostInsertMessageToRhizome');
const Util = require('util');

const FsFile = require('./WriteToFile');

const fileStoragePath = '/home/pi/tmp/';
const filename = "joesExample";
const contentFilename = fileStoragePath + filename + ".json";
const manifestFilename = fileStoragePath + filename + "Manifest.mnfs";

module.exports.insertIntoServal= function (content, recipientSID){

    FsFile.writeToFile(content, fileNamePath);

    FsFile.writeToFile(manifest, filename);

    invokeServalCLIinsert(mySID, contentFilename, manifestFilename);
};

function invokeServalCLIinsert(authorSID, contentFilePath, manifestFilePath){
    let exec = require('child_process').exec;
    let cliCommand = "/home/pi/serval/sbin/servald rhizome add file " + authorSID + " " + contentFilePath + " " + manifestFilePath;
    exec(cliCommand , function(error, stdout){
        if (!error) {
            return true
        } else {
            console.log("Serval bundle insertion messed up: " + error);
            return false
        }

    });
}

function showResponse(responseBody) {

    // Receive/handle response
    console.log("******************************************************************************************************");
    console.log("Inserted:");
    console.log(Util.inspect(responseBody));
    console.log("******************************************************************************************************");
}


module.exports.updateFileRhizomeBundle = function () {
    
}

// gets mySID, builds default manifest, puts everything together and "restful/rhizome/insert"s it
module.exports.insertDefaultRhizomeBundle =
    function insertDefaultRhizomeBundleWith(payload) {
        ServalGET.getMyKeyRingIdentity().then(function (myKeyRing) {
            // console.log("Retrieved myKeyRing: " + Util.inspect(myKeyRing));
            // console.log("Now trying to send POST message");

            ServalPOST.sendRhizomeInsertPostMessage(myKeyRing.identity.sid, payload, showResponse);
        })
    };

