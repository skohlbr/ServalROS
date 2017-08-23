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

module.exports.getMyKeyRingIdentity= function (callback){
    /*  let newKeyRingID = curl http://harry:potter@localhost:4110/restful/keyring/identities.json
    *       => yields https://github.com/servalproject/serval-dna/blob/development/doc/REST-API-Keyring.md#keyring-json-result
    *
     */
    sendGETMessageToServer("localhost",4110,"/restful/keyring/identities.json", (response) => {
        setMyKeyring(response, callback)
    });
};

module.exports.getLatestBundle= function (sinceBID, callback){
    /*  let newKeyRingID = curl http://harry:potter@localhost:4110/restful/keyring/identities.json
    *       => yields https://github.com/servalproject/serval-dna/blob/development/doc/REST-API-Keyring.md#keyring-json-result
    *
     */
    sendGETMessageToServer("localhost",4110,"/restful/rhizome/newsince[/TOKEN]/bundlelist.json", (response) => {
        readAndReturnLastestBundle(response, callback)
    });
};


function setMyKeyring(response, callback) {

    let myKeyRing = JSON.parse(response);
    // console.log("Parsed response keyring contains:");
    // console.log(Util.inspect(myKeyRing));

    let myKeyRingID = blankKeyRing;
    myKeyRingID.identity.sid = myKeyRing.rows[0][0];
    myKeyRingID.identity.identity = myKeyRing.rows[0][1];
    myKeyRingID.identity.did = myKeyRing.rows[0][2];
    myKeyRingID.identity.name = myKeyRing.rows[0][3];
    // console.log("myKeyRingID: " + Util.inspect(myKeyRingID));
    callback(myKeyRingID);
}

module.exports.init = function init() {
    getMyKeyRingIdentity();

};

function sendGETMessageToServer(hostname, port, path, callback) {

    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));

    let bundlename = "test" + Date.now() + ".json";

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
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            // console.log('GET request received response message: \n' + body);
            callback(body);
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.end();

}

function receivingCallback(response) {

}
