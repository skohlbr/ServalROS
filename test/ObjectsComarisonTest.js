const MsgComp = require('../src/ObjectsComparison');

require('mocha');
let expect = require('chai').expect;


// Will be expected
let blankMsgTemplate = {header:"", rows:[], banana:{beer:"", wicked:""}};
blankMsgTemplate.rows[0] = "00";
blankMsgTemplate.rows[1] = "01";

// these should hold expectations
let msgUnderTestGOOD = {header:"", rows:[], banana:{beer:"321", wicked:"654", optionalStuff:"abc"}};
let msgUnderTestBAD1 = {header:"", rows:[], banana:{beer:"321", wFOOBAR:"654", optionalStuff:"abc"}};
let msgUnderTestBAD2 = {header:"", rows:[], banana:{beer:"321", wicked:"654", optionalStuff:"abc"}};

// dynamically allocated fields are also compared/expected
msgUnderTestGOOD.rows[0] = "45";
msgUnderTestGOOD.rows[1] = "67";

msgUnderTestBAD1.rows[0] = "45";
msgUnderTestBAD1.rows[1] = "67";

msgUnderTestBAD2.rows[0] = "45";



describe('ObjectsComparison', function() {
    describe('#validateObjectHasStructure()', function () {
        it('should confirm completeness of object and sub-objects', function () {
            let res = MsgComp.validateObjectHasStructure(blankMsgTemplate, msgUnderTestGOOD);
            expect(res);
        });
        it('should detect missing field in sub-object which was statically defined', function () {
            let res = MsgComp.validateObjectHasStructure(blankMsgTemplate, msgUnderTestBAD1);
            expect(res === false);
        });
        it('should detect missing field in sub-object which was dynamically defined', function () {
            let res = MsgComp.validateObjectHasStructure(blankMsgTemplate, msgUnderTestBAD2);
            expect(res === false);
        });
    });
});
