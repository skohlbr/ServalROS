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


function getKeyRingFrom(keyringResponse) {

    let myRetrievedKeyRing = JSON.parse(keyringResponse);

    let myKeyRingID = blankKeyRing;
    myKeyRingID.identity.sid = myRetrievedKeyRing.rows[0][0];
    myKeyRingID.identity.identity = myRetrievedKeyRing.rows[0][1];
    myKeyRingID.identity.did = myRetrievedKeyRing.rows[0][2];
    myKeyRingID.identity.name = myRetrievedKeyRing.rows[0][3];
    return myKeyRingID;
}

module.exports.getMyKeyRingIdentity = function (){
    return new Promise(
        function (fulfill, reject) {

            let path = "/restful/keyring/identities.json";
            sendGETMessageToServal(path, function(err, res) {
                if (err) {
                    console.log("Keyring-request was rejected! Keyring: " + Util.inspect(res));
                    reject(err);
                } else {
                    let myKeyRing = getKeyRingFrom(res);
                    fulfill(myKeyRing);
                }
            });
        }
    )
};

module.exports.showBundle= function(forBID) {
    let path = "/restful/rhizome/" + forBID + "/raw.bin";
    sendGETMessageToServal(path, (response) => {
        console.log(Util.inspect(response));
    });
};

module.exports.getLatestBundles= function (sinceBID, callback){
    let path = "/restful/rhizome/newsince/" + sinceBID + "/bundlelist.json";
    sendGETMessageToServal(path, (response) => {
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
            //console.log("REQUEST SUCCESS: Retrieval returning result: " + body);
            callback(null, body);
        });
    });
    request.on('error', (e) => {
        console.error(`REQUEST ERROR: problem with request: ${e.message}`);
        callback(e, null);
    });
    request.end();
}

