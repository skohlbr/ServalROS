require('mocha');
let expect = require('chai').expect;

const Util = require("util");
const MsgToRos = require('../src/RosMessages');
const validate = require('../src/ObjectsComparison').validateObjectHasStructure;
const ComCenterMsg = require('../src/CommandCenterMessageTypes');


// example:

const testMsgCreate = "CREATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5";
const testMsgUpdate = "UPDATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5";

const expectedCreatedManifestAppendix = 'filename=map.png\r\nmap_resolution=0.05\r\nmap_origin_pos_x=-2.5\r\nmap_origin_pos_y=-2.5\r\n';

describe('MessageToROS', function() {
    describe('#validateObjectHasStructure()', function () {
        it('should parse an incoming CREATE message as expected', function () {
            let parsedMsg = MsgToRos.parseMessage(testMsgCreate);
            let res = validate(ComCenterMsg.EmptyIncomingRosPhotoMessage, parsedMsg);
            expect(res).to.be.true;
        });
        it('should parse an incoming UPDATE message as expected', function () {
            let parsedMsg = MsgToRos.parseMessage(testMsgUpdate);
            let res = validate(ComCenterMsg.EmptyIncomingRosPhotoMessage, parsedMsg);
            expect(res).to.be.true;
        });
        it('should build an MANIFEST APPENDIX for an incoming UPDATE message as expected', function () {
            let parsedMsg = MsgToRos.parseMessage(testMsgUpdate);
            expect(parsedMsg.manifestAppendix).to.be.equal(expectedCreatedManifestAppendix);
        });


    });
});
