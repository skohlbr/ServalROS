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

//module.exports.sendExampleFile =
function sendExampleFile(payloadInput, storeToFilename) {

    // TODO: Move message-components building here

    sendPostMessage("127.0.0.1", 4110, "/restful/rhizome/insert", payloadInput, storeToFilename, (response) => {
        console.log("Blank callback invoked ..");
    })

}

function literalPOSTmessage() {

}

function sendPostMessage(hostname, port, path, payloadInput, callback) {

    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));

    const crlf = "\r\n"; //String.fromCharCode(10); // use only \n as newline (UNIX style) .. using \r\n yields problems

    // create a 40 characters core-boundary
    // let boundary = "------------------------53c429e7f7c55c0f";
    let boundary = "--------------boundary" + Math.random().toString(8).replace(".","");
    let startBoundary = "--" + boundary;
    //let endBoundary = boundary + "--" ;
    let endBoundary = startBoundary + "--" + crlf ;

    // bundle-id .. only applicable if you want to change a bundle / append to a bundle
    let bundleId = '0000';
    let bundleIdHeader = 'Content-Disposition: form-data; name="bundle-id"' + crlf +
        'Content-Type: text/plain; charset=utf-8' + crlf + 'Content-Length: 64';

    // bundle-author: Always needed .. as a creator of this bundle, this is usually your local sid
    let bundleAuthor = myKeyRingID.identity.sid;
    let bundleAuthorSize = 64;
    let bundleAuthorHeader = 'Content-Disposition: form-data; name="bundle-author"';

    // bundle-secret .. necessary if you want to create a bundle with certain bundle id (basically to change/update a bundle)
    let bundleSecret = '0000';
    let bundleIdSecret = 'Content-Disposition: form-data; name="bundle-secret"'; // + crlf + 'Content-Length: 64';

    // payload .. follows after manifest, but filesize is important for manifest, must not be appended, if filesize is 0
    let payload =
        '#!/bin/bash\n' +
        'echo "Banana!"';
    if(payloadInput && payloadInput !== undefined && payloadInput !== null) {payload = payloadInput}
    let payloadFilesize = Buffer.byteLength(payload);

    // 'name=banana\n' + // in case file is added

    let manifest =
        'service=rhizome' + crlf +
        'name=myAwesomeExample' + crlf +
        'sender=' + myKeyRingID.identity.sid + crlf +
        'crypt=0' + crlf;
    let manifestSize = Buffer.byteLength(manifest);

    let manifestHeader =
        'Content-Disposition: form-data; name="manifest"; filename="manifest1"' + crlf +
        'Content-Type: rhizome/manifest;format="text+binarysig"';
    let payloadHeader =
        'Content-Disposition: form-data; name="payload"; filename="myAwesomeExample.txt"' + crlf + //storeToFilename + '"' + crlf +
        'Content-Type: application/octet-stream';

    let postData =
        startBoundary + crlf +
        bundleAuthorHeader + crlf + crlf + bundleAuthor + crlf +
        startBoundary + crlf +
        manifestHeader + crlf +  crlf + manifest + crlf;

    if (payloadFilesize > 0) {
        postData +=
            startBoundary + crlf +
            payloadHeader + crlf +  crlf + payload + crlf + crlf;
    }

    postData += endBoundary;

    let postHeaders = {
        Authorization: authStringEnc,
        Accept: "*/*",
        'User-Agent': 'curl/7.38.0'
    };

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        expect: '',
        headers: postHeaders
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
            console.log("******************************************************************************************************");
            console.log("Tried to insert message into Serval. Whole response body from Serval REST API:");
            // console.log(Util.inspect(request)); // pages of stuff
            console.log(Util.inspect(body)); // pages of stuff
            console.log("******************************************************************************************************");

            // console.log(Util.inspect(body));
            callback();
        });
    });

    // see request.on('connect') : https://nodejs.org/api/http.html#http_event_connect
    request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    //let wholeSize = bundleAuthorSize + manifestSize + payloadFilesize;
    let wholeSize = Buffer.byteLength(postData);

    request.setHeader('Content-Length', wholeSize);
    request.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    request.removeHeader('Connection');
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
