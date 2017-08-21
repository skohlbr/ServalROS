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

let myKeyRing = blankKeyRing;

getMyKeyRingIdentity();


function getMyKeyRingIdentity(){
    /*  let newKeyRingID = curl http://harry:potter@localhost:4110/restful/keyring/identities.json
    *       => yields https://github.com/servalproject/serval-dna/blob/development/doc/REST-API-Keyring.md#keyring-json-result
    *
     */
    sendGETMessageToServer("localhost",4110,"/restful/keyring/identities.json",setMyKeyring);
}

function setMyKeyring(response) {

    let parsedBody = JSON.parse(response.body);
    let myKeyRing =  parsedBody;
    console.log("Parsed response keyring contains:");
    console.log(Util.inspect(myKeyRing));
}

module.exports.init = function init() {
    let myKeyRingID = getMyKeyRingIdentity();
    let did = myKeyRingID.identity.did;
    let sid = myKeyRingID.identity.sid;
    let identity = myKeyRingID.identity.identity;

    console.log("DID: " + did);
    console.log("SID: " + sid);
    console.log("AID: " + identity);
};


const blankMsgWithSmallManifest = {
    "bundle-author": "",
    "manifest": {
        "id": "",
        "version": "",
        "filesize": 0,
        "service": "theNodeToServalToRosThing",
        "date": 0,
    },
    "payload" : {

    }
};


module.exports.sendExampleMessage = function sendExampleMessage(messageText) {
    // TODO: PROCEED HERE: create client, build some resonable bundle with headers

    let postData = blankMsgWithSmallManifest;
    postData.manifest.version = "0.1";

    sendPOSTMessageToServer("localhost", 4110, "/restful/rhizome/insert", postData, receivingCallback)
};

function sendPOSTMessageToServer(hostname, port, path, postData, callback) {

    const authString = "Basic " + (new Buffer("harry:potter").toString('base64'));

    let bundlename = "test" + Date.now() + ".json";

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Authorization': authString,
            'Content-Type': 'rhizome/manifest; format=text+binarysig',
            'Content-Length': Buffer.byteLength(postData),
            'Serval-Rhizome-Bundle-Name': bundlename,
            'Serval-Rhizome-Bundle-Crypt': 0
        }
    };

    const request = http.request(options, (response) => {
        let body = "";
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            // console.log('Received message: \n' + body);
            callback();
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.write(postData);
    request.end();

}

function sendGETMessageToServer(hostname, port, path, callback) {

    const authString = "Basic " + (new Buffer("harry:potter").toString('base64'));

    let bundlename = "test" + Date.now() + ".json";

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'GET',
        headers: {
            'Authorization': authString,
            'Accept': '*/*'
        }
    };

    const request = http.request(options, (response) => {
        let body = "";
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            // console.log('Received message: \n' + body);
            callback();
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.end();

}

function receivingCallback(response) {
    console.log("Tried to insert message into Serval. Response from Serval REST API:");
    console.log(Util.inspect(response))
}