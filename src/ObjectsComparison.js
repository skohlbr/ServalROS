
function validateObjectHasStructure (blankMsgWithRequiredFields, msgToValidate) {

    let result = true;
    Object.keys(blankMsgWithRequiredFields).some( function (key) {

        if (blankMsgWithRequiredFields.hasOwnProperty(key) && msgToValidate.hasOwnProperty(key)) {

            console.log(
                "Key: " + key + " , " +
                "ValueBlank: " + blankMsgWithRequiredFields[key]+ " , " +
                "ValueNew: " + msgToValidate[key]
            );

            if (typeof blankMsgWithRequiredFields[key] === 'object') {
                console.log("Analyzing sub-object: " + key);
                let defResult = validateObjectHasStructure(blankMsgWithRequiredFields[key], msgToValidate[key]);
                result = result && defResult && (defResult !== undefined);
                console.log("Subobject valid: " + result);
            }

        } else {
            console.log("Fail at " + key);
            result = false;
        }
    });
    // in case there is no more properties
    return result;
}

// validateMsgType recursively validates object structures with given structures;
module.exports.validateObjectHasStructure = validateObjectHasStructure;
