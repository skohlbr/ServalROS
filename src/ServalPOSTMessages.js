/**
 *  This should send an unencrypted exmple message without payload to serval
 */

let http = require('http');
const Util = require("util");

function buildBoundary() {
    return "--------------boundary" + Math.random().toString(8).replace(".", "");
}


function buildPostBody(mySID, boundary, manifestExtension, payloadInput) {
    const crlf = "\r\n"; //String.fromCharCode(10); // use only \n as newline (UNIX style) .. using \r\n yields problems

    // create a 40 characters core-boundary
    let startBoundary = "--" + boundary;
    let endBoundary = startBoundary + "--" + crlf;

    // bundle-id .. only applicable if you want to change a bundle / append to a bundle
    let bundleId = '0000';
    let bundleIdHeader = 'Content-Disposition: form-data; name="bundle-id"' + crlf +
        'Content-Type: text/plain; charset=utf-8' + crlf + 'Content-Length: 64';

    // bundle-author: Always needed .. as a creator of this bundle, this is usually your local sid
    let bundleAuthor = mySID;
    let bundleAuthorSize = 64;
    let bundleAuthorHeader = 'Content-Disposition: form-data; name="bundle-author"';

    // bundle-secret .. necessary if you want to create a bundle with certain bundle id (basically to change/update a bundle)
    let bundleSecret = '0000';
    let bundleIdSecret = 'Content-Disposition: form-data; name="bundle-secret"'; // + crlf + 'Content-Length: 64';

    // payload .. follows after manifest, but filesize is important for manifest, must not be appended, if filesize is 0
    let payload =
        '#!/bin/bash\n' +
        'echo "Banana!"';
    if (payloadInput && payloadInput !== undefined && payloadInput !== null) {
        payload = payloadInput
    }
    let payloadFilesize = Buffer.byteLength(payload);

    let manifest =
        'service=rhizome' + crlf +
        'sender=' + mySID + crlf +
        'crypt=0' + crlf +
        manifestExtension + crlf;
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
        manifestHeader + crlf + crlf + manifest + crlf;

    if (payloadFilesize > 0) {
        postData +=
            startBoundary + crlf +
            payloadHeader + crlf + crlf + payload + crlf + crlf;
    }

    postData += endBoundary;
    return postData;
}

function buildOptionsAndHeaders() {
    const authString = "harry:potter";
    const authStringEnc = "Basic " + (new Buffer("harry:potter").toString('base64'));

    const hostname = "127.0.0.1";
    const port = 4110;
    const path = "/restful/rhizome/insert";

    let postHeaders = {
        Authorization: authStringEnc,
        Accept: "*/*",
        'User-Agent': 'joes/0.00.2'
    };

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        expect: '',
        headers: postHeaders
    };
    return options;
}

module.exports.sendRhizomeInsertPostMessage = function (mySID, manifestExtension, payloadInput, callback) {

    // TODO: build second method that takes completely new manifest instead of extension

    let boundary = buildBoundary();

    let postData = buildPostBody(mySID, boundary, manifestExtension, payloadInput);
    let options = buildOptionsAndHeaders();

    const request = http.request(options, (response) => {
        let body = "";
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            // console.log(Util.inspect(request)); // pages of stuff
            callback(body);
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

    /*
    console.log("******Going to send the following request: ****************************");
    console.log(Util.inspect(request));
    console.log("******END OF REQUEST TO SEND ****************************");
     */

    request.end();
};
