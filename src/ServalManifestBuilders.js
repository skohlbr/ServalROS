
const crlf = "\r\n";

// BUILDING MANIFESTS
module.exports.buildDefaultManifestExtension = function (){
    return 'name=defaultname' + Date.now();
};

module.exports.buildInsertFileManifestFor=function (msg) {
    // TODO: build special manifest for file insert
    // ** required fields:
    // "name=" + msg.whatever.name
    // "filename=" + msg.whatever.filename

    // ** optional fields: yourownstuff= ...
    return "";
};

module.exports.buildUpdateFileManifestFor= function (msg) {
    // TODO: build special manifest for update
    // required fields
    // "name=" + msg.whatever.name
    // "filename=" + msg.whatever.filename
    // optional fields:
    // yourownstuff= ...

    // TODO: Previous bundleid "id" is necessary for updating file => how to handle previous bundle-id??
    return "";
};


module.exports.buildManifestAppendixFrom= function (msgArray, beginAtLineOffset){
    if (!Array.isArray(msgArray)) {return false}
    let aLen = msgArray.length;
    if (aLen <= 0) {return false}

    let msgAppendixArray = [];
    let i = 0;
    while (i < (aLen - beginAtLineOffset)) {
        msgAppendixArray[i] = msgArray[i + beginAtLineOffset];
        i = i + 1;
    }

    let manifestAppendix = "";
    for (let line in msgAppendixArray) {
        manifestAppendix += msgAppendixArray[line] + "\r\n";
    }
    return manifestAppendix;
};
