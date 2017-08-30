
const Serval = require('../src/ServalMessages');

require('mocha');
let expect = require('chai').expect;

describe('ServalMessages Integration Test', function() {
    describe('#Insert and GetLatest', function () {
        it('should insert bundle and read it back', function () {
            let testPayload = "Testpayload:" + Date.now();
            Serval.insertDefaultRhizomeBundleWith().then(()=> {

                Serval.simplifiedGetVeryLatestBundleID().then((latestBundleID) => {

                    let veryLatestBundleID = Serval.getBundle(latestBundleID);

                    ObjComp.validateObjectHasStructure(blankBundle, veryLatestBundleID);

                    console.log("\n" + Date.now() + ":\n" + Util.inspect(veryLatestBundleID));

                    let newMsg = veryLatestBundleID.payload;

                    expect(newMsg === testPayload).to.be.true;

                })
            });


        });
    });
});

