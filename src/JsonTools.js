function createJsonArrayFromJsonTable (jsonTable) {
    let headerItemCount = jsonTable.header.length;
    let rowCount = jsonTable.rows.length;
    if (rowCount <= 0) {return "{ }"}

    let bundles = [];

    let currentRowPos = 0;
    while(currentRowPos < rowCount) {

        let newJSON = {};
        let currentHeaderPos = 0;

        while(currentHeaderPos < headerItemCount) {

            let currentHeaderKey = jsonTable.header[currentHeaderPos];
            newJSON[currentHeaderKey] = jsonTable.rows[currentRowPos][currentHeaderPos];

            currentHeaderPos += 1;
        }

        bundles.push(newJSON);
        currentRowPos += 1;

    }
    return bundles;
}


function checkAndRepairJsonBundleList(inputString){
    const expectedBeginChars = '{';
    const rows = '"rows":[';
    const expectedFinalChars =  ']}';
    const openEnd = "],";
    const fullHeader = '{"header":[".token","_id","service","id","version","date",".inserttime",".author",".fromhere","filesize","filehash","sender","recipient","name"],"rows":[';

    if (!inputString) {return false}

    let tempString = inputString.replace("\n","");

    if (inputString.includes(expectedBeginChars)){

        if (!tempString.includes(rows)) {
            // EMPTY DATABASE
            return false
        }

        if (inputString.endsWith(expectedFinalChars)) {
            // COMPLETE
            return inputString
        } else {
            // ADD MISSING TAIL
            let posOfOpenEnd = tempString.lastIndexOf(openEnd);
            tempString = tempString.slice(0, posOfOpenEnd + 1);
            tempString += expectedFinalChars;
        }
    } else {
        // ADD MISSING HEADER
        tempString = fullHeader + tempString;
    }

    // drop everything after open end
    let res;

    try {
        let intermediateJSON = JSON.parse(tempString);
        res = createJsonArrayFromJsonTable(intermediateJSON);
    } catch(e) {
        console.log(e);
        res = false;
    }

    return res;
}

module.exports.createJsonArrayFromJsonTable = createJsonArrayFromJsonTable;
module.exports.checkAndRepairJsonBundleList = checkAndRepairJsonBundleList;
