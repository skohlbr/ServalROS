/**
 *  This should send an unencrypted exmple message without payload to serval
 */

let http = require('http');
const Util = require("util");

const blankKeyRing = {
    "http_status_code": "",
    "http_status_message": "",
    "identity": {
        "sid": "", // <hex64>
        "identity": "", //<hex64>
        "did": "",
        "name": ""
    }
};


function getAndStoreMyKeyRingID() {
    getMyKeyRingIdentity(setMyKeyring)
}

function getMyKeyRingIdentity (callback){
    //  https://github.com/servalproject/serval-dna/blob/development/doc/REST-API-Keyring.md#keyring-json-result
    sendGETMessageToServal("localhost",4110,"/restful/keyring/identities.json", callback(response));
}

function setMyKeyring(response) {

    let myKeyRing = JSON.parse(response);
    // console.log("Parsed response keyring contains:");
    // console.log(Util.inspect(myKeyRing));

    let myKeyRingID = blankKeyRing;
    myKeyRingID.identity.sid = myKeyRing.rows[0][0];
    myKeyRingID.identity.identity = myKeyRing.rows[0][1];
    myKeyRingID.identity.did = myKeyRing.rows[0][2];
    myKeyRingID.identity.name = myKeyRing.rows[0][3];
    // console.log("myKeyRingID: " + Util.inspect(myKeyRingID));
}

function sendGETMessageToServal(path, callback) {

    hostname = "localhost";
    port = 4110;
    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'GET',
        headers: {
            'Authorization': authStringEnc,
            'Accept': '*/*'
        }
    };

    const request = http.request(options, (response) => {
        let body = "";
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            callback(body);
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    request.end();
}

module.exports.showBundle= function(forBID) {
    sendGETMessageToServal("/restful/rhizome/" + forBID + "/raw.bin", (response) => {
        console.log(Util.inspect(response));
    });
};

module.exports.getLatestBundles= function (sinceBID, callback){
    sendGETMessageToServal("/restful/rhizome/newsince/" + sinceBID + "/bundlelist.json", (response) => {
        readAndShowLastestBundle(response.body, callback)
    });
};

function readAndShowLastestBundle(bundleList, callback){
    console.log(bundleList);
    if (bundleList.hasOwnProperty('rows')) {
        if (bundleList.rows.cou > 0) {
            callback(bundleList.rows[0][1]);
        }
    }

    callback(false);
}

