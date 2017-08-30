/**
 *  This should send an unencrypted exmple message without payload to serval
 */

let http = require('http');
const Util = require("util");
const JsonTools = require('./JsonTools');

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

const blankProcessedBundle = {bid:0, version:0};
let processedBundlesList = [blankProcessedBundle];

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
                    console.log("ERROR: Request to " + path + " yields:");
                    console.log(Util.inspect(res));
                    reject(err);
                } else {
                    let myKeyRing = getKeyRingFrom(res);
                    fulfill(myKeyRing);
                }
            });
        }
    );
};

module.exports.getBundle = function (forBID) {
    return new Promise(
        function (fulfill, reject) {
            if (!forBID) {return false}

            let path = "/restful/rhizome/" + forBID + "/raw.bin";
            sendGETMessageToServal(path, function(err, res) {
                if (err) {reject(err)}
                console.log("Received Bundle:");
                console.log(Util.inspect(res));
                fulfill(res);
            });
        }
    );
};


function getBundleList() {
    let path = '/restful/rhizome/bundlelist.json';
    sendGETMessageToServal(path, function(err, res) {
        if (err) {reject(err)}
        console.log(Util.inspect(res));
        return res.body;
    });
}


module.exports.simplifiedGetVeryLatestBundleID= function () {
    return new Promise(
        function (fulfill, reject) {
            let path = '/restful/rhizome/bundlelist.json';
            sendGETMessageToServal(path, function(err, res) {
                if (err) {
                    console.log("**************** ERROR: Request to " + path + " yields:");
                    console.log(Util.inspect(res));
                    reject(err);
                } else {

                    let fixedBundleList = JsonTools.checkAndRepairJsonBundleList(res);
                    if (!fixedBundleList ) {
                        console.log("**************** Broken BundleList Response: Response is: ");
                        console.log(Util.inspect(res));
                        reject(res)
                    } else {

                        // TODO: Change this to read, fix, manage (store: compare/add/update/drop), and process all the bundles

                        //let latestBundleID = getLatestBundleWithoutTokenIdFromBundleArray(fixedBundleList);

                        // always return the last-received item on top of the list
                        let latestBundleID = getLatestBundleWithTokenIdFromBundleArray(fixedBundleList);

                        console.log("Latest bundle is: " + latestBundleID);
                        fulfill(latestBundleID);

                    }
                }
            });
        }
    );
};

function getLatestBundleWithTokenIdFromBundleArray(bundleArray) {
    return bundleArray[0].id;
}
module.exports.getLatestBundleWithTokenIdFromBundleArray = getLatestBundleWithTokenIdFromBundleArray;

function getLatestBundleWithoutTokenIdFromBundleArray(bundleArray) {
    let len = bundleArray.length;
    for (let linePos = 0; linePos < len; linePos += 1) {
        if (bundleArray[linePos]['.token'] === null) {
            return bundleArray[linePos].id;
        }
    }
    return false
}
module.exports.getLatestBundleWithoutTokenIdFromBundleArray = getLatestBundleWithoutTokenIdFromBundleArray;

function mayTryToTouchBundleList(res) {
    if (!res.hasOwnProperty('body')) {return false}
    if (!res.body.hasOwnProperty('rows')) {return false}
    if (!res.body.rows[0]) {return false}

    // TODO: Write test for this function! Need more invalidators?
    return true
}

module.exports.getLatestBundles= function (sinceBID, callback){
    let path = "/restful/rhizome/newsince/" + sinceBID + "/bundlelist.json";
    sendGETMessageToServal(path, (response) => {
        readAndShowLatestBundle(response.body, callback)
    });
};

function readAndShowLatestBundle(bundleList, callback){
    console.log(bundleList);
    if (bundleList.hasOwnProperty('rows')) {
        if (bundleList.rows.length > 0) {
            callback(bundleList.rows[0][1]);
        }
    }

    callback(false);
}


function sendGETMessageToServal(path, callback) {
    let hostname = "localhost";
    let port = 4110;
    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer(authString).toString('base64'));

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
        console.error('ERROR: REQUEST ERROR: problem with request: ' + e.message);
        callback(e, null);
    });
    request.end();
}

