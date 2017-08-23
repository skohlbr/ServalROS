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

    let storeToFilename = "test" + Date.now() + ".json";

    sendExampleFile('', storeToFilename);
}

module.exports.init = function init() {
    getMyKeyRingIdentity();

};

// see https://stackoverflow.com/questions/32087500/boundary-in-httppost
// and https://stackoverflow.com/questions/37712081/uploading-a-file-with-node-http-module

//module.exports.sendExampleFile =
function sendExampleFile(payloadInput, storeToFilename) {

    // TODO: Move message-components building here

    sendPOSTMessageToServer("localhost", 4110, "/restful/rhizome/insert", payloadInput, storeToFilename, (response) => {
        console.log("Blank callback invoked ..");
    })

}

function sendPOSTMessageToServer(hostname, port, path, payloadInput, storeToFilename, callback) {

    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));

    const crlf = String.fromCharCode(10); // use only \n as newline (UNIX style) .. using \r\n yields problems

    let boundary = "-=boundary" + Math.random().toString(16) + "=-";
    let startBoundary = "--" + boundary;
    let endBoundary = boundary + "--" ;

    // bundle-id .. only applicable if you want to change a bundle / append to a bundle
    let bundleId = '0000';
    let bundleIdHeader = 'Content-Disposition: form-data; name="bundle-id"' + crlf +
        'Content-Length: 64';

    // bundle-author: Always needed .. as a creator of this bundle, this is usually your local sid
    let bundleAuthor = myKeyRingID.identity.sid;
    let bundleAuthorHeader = 'Content-Disposition: form-data; name="bundle-author"' + crlf +
        'Content-Length: 64';

    // bundle-secret .. necessary if you want to create a bundle with certain bundle id (basically to change/update a bundle)
    let bundleSecret = '0000';
    let bundleIdSecret = 'Content-Disposition: form-data; name="bundle-secret"' + crlf +
        'Content-Length: 64';

    // payload .. follows after manifest, but filesize is important for manifest, must not be appended, if filesize is 0
    let payload = '';
    if(payloadInput && payloadInput !== undefined && payloadInput !== null) {payload = payloadInput}
    let payloadHeader =
        'Content-Disposition: form-data; name="payload"; filename="' + storeToFilename + '"' + crlf +
        'Content-Length: ' + Buffer.byteLength(payload);

    let payloadFilesize = Buffer.byteLength(payload);

    let manifest =
        'sender=' + myKeyRingID.identity.sid + crlf +
        'BK=0' + crlf +
        'crypt=0' + crlf +
        'filesize=' + payloadFilesize;
    let manifestHeader =
        'Content-Disposition: rhizome/manifest; format=text+binarysig; name="manifest"' + crlf +
        'Content-Length: ' + Buffer.byteLength(manifest);

    let postData = crlf +
        startBoundary + crlf +
        bundleAuthorHeader + crlf + crlf + bundleAuthor + crlf +
        startBoundary + crlf +
        manifestHeader + crlf +  crlf + manifest + crlf;

    if (payloadFilesize > 0) {
        postData +=
            startBoundary + crlf +
            payloadHeader + crlf +  crlf + payload + crlf;
    }

    postData += endBoundary;


    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            Authorization: authStringEnc,
            Accept: "*/*",
            //'Content-Type': 'multipart/form-data; boundary="' + boundary + '"',
            'Content-Length':  Buffer.byteLength(postData)
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
    request.write(postData);

    console.log("******Going to send the following request: ****************************");
    console.log(Util.inspect(request));
    console.log("******END OF REQUEST TO SEND ****************************");

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
