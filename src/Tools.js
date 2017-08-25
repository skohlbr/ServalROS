module.exports.createJsonArrayFrom = function (jsonTable) {
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
};
