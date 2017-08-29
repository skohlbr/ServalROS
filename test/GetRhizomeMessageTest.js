const RhizomePOST = require('../src/PostInsertMessageToRhizome');
const RhizomeGET = require('../src/GetRhizomeMessage');

require('mocha');
let expect = require('chai').expect;

const knownExistingBundleID = "CC33880E952D5A2837A639A65FBD65D609FC7C0DF8D0D788BA9D94EE57B2A3F7";

describe('RhizomeGET', function() {
    describe('#hasMsgType()', function () {
        it('should detect missing msgType field', function () {
            RhizomeGET.getLatestBundles(knownExistingBundleID).then((res) => {if (!res) {done(true)} else {done()}});
        });
        it('should confirm existing msgType field', function () {

        });
    });
});
