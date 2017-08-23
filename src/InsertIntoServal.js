const ServalGET = require('./MessageToServalGET');
const FsFile = require('./WriteToFile');

const fileStoragePath = '/home/pi/tmp/';
const filename = "joesExample";
const contentFilename = fileStoragePath + filename + ".json";
const manifestFilename = fileStoragePath + filename + "Manifest.mnfs";

module.exports.insertIntoServal= function (content, recipientSID){
    let mySID;
    ServalGET.getMyKeyRingIdentity( (result) => {
        mySID = result;
    });

    FsFile.writeToFile(content, fileNamePath);

    let manifest = getIncompleteBroadcastManifest(mySID);
    FsFile.writeToFile(manifest, filename);

    invokeServalCLIinsert(mySID, contentFilename, manifestFilename);

};

function getIncompleteBroadcastManifest(forSID){
    return 'sender=' + forSID + '\n' +
    'crypt=0';
}

function getIncompleteRecipientManifest(fromAuthorSID, toRecipientSID) {
    return 'recipient=' + toRecipientSID + '\n' +
    getIncompleteBroadcastManifest(fromAuthorSID);
}

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
