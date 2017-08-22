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

let myKeyRingID = blankKeyRing;

function getMyKeyRingIdentity(){
    /*  let newKeyRingID = curl http://harry:potter@localhost:4110/restful/keyring/identities.json
    *       => yields https://github.com/servalproject/serval-dna/blob/development/doc/REST-API-Keyring.md#keyring-json-result
    *
     */
    sendGETMessageToServer("localhost",4110,"/restful/keyring/identities.json",setMyKeyring);
}

function setMyKeyring(response) {

    let myKeyRing = JSON.parse(response);
    // console.log("Parsed response keyring contains:");
    // console.log(Util.inspect(myKeyRing));

    myKeyRingID.identity.sid = myKeyRing.rows[0][0];
    myKeyRingID.identity.identity = myKeyRing.rows[0][1];
    myKeyRingID.identity.did = myKeyRing.rows[0][2];
    myKeyRingID.identity.name = myKeyRing.rows[0][3];
    console.log("myKeyRingID: " + Util.inspect(myKeyRingID));

    sendExampleMessage()
}

module.exports.init = function init() {
    getMyKeyRingIdentity();

};


const blankMsgWithSmallManifest = {
    "bundle-author": "",
    "BK": "",
    "manifest": {
        "id": "",
        "version": "",
        "filesize": 0,
        "service": "theNodeToServalToRosThing",
        "date": 0,
    }
    //, "payload" : {    }
};


//module.exports.sendExampleMessage =
function sendExampleMessage(messageText) {

    let postData = blankMsgWithSmallManifest;
    postData.manifest.version = "0.1";
    postData.manifest['bundle-author'] = myKeyRingID.identity.sid;
    postData.manifest['BK'] = myKeyRingID.identity.sid;

    sendPOSTMessageToServer("localhost", 4110, "/restful/rhizome/insert", postData, (response) => {
        console.log("Blank callback invoked ..");
    })
}

function sendPOSTMessageToServer(hostname, port, path, postData, callback) {

    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));
    const crlf = String.fromCharCode(10);

    let bundlename = "test" + Date.now() + ".json";
    let boundary = "-=boundary" + Math.random().toString(16) + "=-";
    let postDataString = JSON.stringify(postData);

    let manifestHeader =
        'Content-Disposition: rhizome/manifest; format=text+binarysig; name="' + bundlename + '",' + crlf +
        'Content-Length: ' + Buffer.byteLength(postDataString); // + crlf +
        //'filename="joesNodeToServalTestRun.json"';

    let dataToSend = crlf +
        "--" + boundary + crlf +
        manifestHeader + crlf +
        postDataString + crlf +
        boundary + "--" + crlf;

    // TODO: Keep working on building this message-headers

    let headerString = {
        'Authorization': authStringEnc,
        'Accept': "*/*",
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
        //'Content-Type': 'rhizome/manifest; format=text+binarysig; boundary="' + boundary + '"',
        'Serval-Rhizome-Bundle-BK': postData.manifest['BK'],
        'Serval-Rhizome-Bundle-Sender': postData.manifest['bundle-author'],
        'Serval-Rhizome-Bundle-Author': postData.manifest['bundle-author'],
        'Serval-Rhizome-Bundle-Name': bundlename,
        'Serval-Rhizome-Bundle-Crypt': 0,
        'Content-Length': Buffer.byteLength(dataToSend)
    };

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',

        headers: headerString

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
            console.log("******************************************************************************************************");
            console.log("Tried to insert message into Serval. Whole response body from Serval REST API:");
            // console.log(Util.inspect(request)); // pages of stuff
            console.log(Util.inspect(body)); // pages of stuff
            console.log("******************************************************************************************************");

            // console.log(Util.inspect(body));
            callback();
        });
    });

    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    request.write(dataToSend);

    console.log("**********************************");
    console.log("Going to send the following request:");
    console.log(Util.inspect(request));

    request.end();

}

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
