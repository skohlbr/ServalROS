const Util = require('util');

const exampleBundleList =
    {
        "header":[".token","_id","service","id","version","date",".inserttime",".author",".fromhere","filesize","filehash","sender","recipient","name"],
        "rows":[
            ["8TfKRDFzR7y7_wgBLTJwBwMAAAAAAAAA",3,"rhizome","D89295B01C7137179799F1E2DDFF0300DCA64C16CD6566AC42B5D6336EC38B88",1503692205610,1503692205610,1503692205663,"48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",1,79,"8D5CB5D9FAC20FD76C58D15D0863CC7053242DC2CA5B477D8851AAE2181639DBF6D54FC55BFE706EC4A9DB4A412D6679CF7DE8A98A7856702B38438C64CF86C8","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",null,"myAwesomeExample"],
            [null,2,"rhizome","C01F01F1AE7D125CFA5C2979B5DC5C0676B002FB017394473E7F1DBD00DCB67F",1503691990251,1503691990252,1503691990304,"48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",1,85,"71B075B7F3E2905045874AD127294573865E7D2B538F3EB2E85B4812081FB885AA453100D54B1F30E97FBA5319A328942319D0CBC88CA1516F762E86C5434B70","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",null,"myAwesomeExample"],
            [null,1,"rhizome","6367FC93278C30EB5EF0B23F5B053D78BA14C14A307C5A28A862566A8F46BB4A",1503691080525,1503691080526,1503691080580,"48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",1,85,"8429131F5BBEBB37DBB02AA0F1A5E8FA34C486AF288BD7EE1D8FB1AC61D0CD92580AD58F3873A095C36B39B3A9AA3B418196AE082C73A9156AFA6789DEF7D381","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",null,"myAwesomeExample"]
        ]
    }
;



const incompleteJsonEmptyDatabase = '{"header":[".token","_id","service","id","version","date",".inserttime",".author",".fromhere","filesize","filehash","sender","recipient","name"],';

const incompleteJsonOpenEnd = '{\n' +
    '"header":[".token","_id","service","id","version","date",".inserttime",".author",".fromhere","filesize","filehash","sender","recipient","name"],\n' +
    '"rows":[\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wIAAAAAAAAA",2,"private","B382ABA73B0904D153F5F509715BF4049324CC3B52D3CAB6662876CEC58E3973",1503053819669,1503053819669,1504032920413,null,0,41,"A8683C0CD8F4B0DC7D0D7CDBF437FACB6E8888D30AA8145D519F7B70EE774373547F40844A6ED261B8736E706A1EFF9A5FB5AF77CDEA73D2C155FEB8AD9D7835",null,null,null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wMAAAAAAAAA",3,"private","6C5D760090CA3F50E1AF0C65C00D2E5B9E548A68171D32B31049CCD762B9B5CC",1503054045061,1503054045060,1504032920505,null,0,41,"CA82CEE378550E78D2C04922AB44902DC50BC8B253F6F02743F883C7719083B69F7FE4F33F7B9ED95564A568D9A93A2C9757752E2B8BBB298A7D13EECFD07DBB",null,null,null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wQAAAAAAAAA",4,"MeshMS2","520B6E4A94505890586CF2211E204BDE2F45F053C1A904FB5660AF6E658B023A",13,1503053819671,1504032920595,null,0,13,"66033CE52E968D72855641541227316AE4460FCCD0A3323B0DB67045B217A43DA95D75705E5E3A94C02CC80A20ECF01293DB22379571151375C8738A97BFECFC","AD087C790868AF801C3FFD64040E911CD4A8E1417559C8F380D3395ADA75A13A","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wUAAAAAAAAA",5,"MeshMS2","B83C88D908D4DFC548885FCDC301A4AEF1E4175B0E02F3B1EC4E80FF9596CB49",9,1503054045091,1504032920740,"48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",1,9,"F5C5C2349EB58686B6327FCEF215C2B4D6749E91066981FAD61ADF9DE3E2FB893B2178DB9AD20D31E4B2D839AE049A9C42CA3939CAE96F5029D0D1D09001F53F","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34","AD087C790868AF801C3FFD64040E911CD4A8E1417559C8F380D3395ADA75A13A",null],\n';

const incompleteJsonLostBeginning = '\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wcAAAAAAAAA",7,"MeshMS2","5CA2056356F2866BD50D0CEC67DC2ABFF9F57CDE93C18257E949581249D025F6",36,1503052779813,1504032983400,null,0,36,"44C9D89710A2A889CD1935D5D3934D76C2328D9E348D9FD06577ABA87B3C4484F9C14361FA2F4E2D6B501A64ED7D1022BD60A521C1EDD08B1E98DA380F0AFB6D","3B3695E5DBA2CA321A1ED008E662FB4A06603C63D458DB20ADCDE285908C834C","1C85B797DB7B4BCBFFBDE73E6BB93CEEB94FEF5E0AF58A8B9BEC289CBCCF0B73",null]\n' +
    ']\n' +
    '}\n';


const completeJson = '{\n' +
    '"header":[".token","_id","service","id","version","date",".inserttime",".author",".fromhere","filesize","filehash","sender","recipient","name"],\n' +
    '"rows":[\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wIAAAAAAAAA",2,"private","B382ABA73B0904D153F5F509715BF4049324CC3B52D3CAB6662876CEC58E3973",1503053819669,1503053819669,1504032920413,null,0,41,"A8683C0CD8F4B0DC7D0D7CDBF437FACB6E8888D30AA8145D519F7B70EE774373547F40844A6ED261B8736E706A1EFF9A5FB5AF77CDEA73D2C155FEB8AD9D7835",null,null,null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wMAAAAAAAAA",3,"private","6C5D760090CA3F50E1AF0C65C00D2E5B9E548A68171D32B31049CCD762B9B5CC",1503054045061,1503054045060,1504032920505,null,0,41,"CA82CEE378550E78D2C04922AB44902DC50BC8B253F6F02743F883C7719083B69F7FE4F33F7B9ED95564A568D9A93A2C9757752E2B8BBB298A7D13EECFD07DBB",null,null,null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wQAAAAAAAAA",4,"MeshMS2","520B6E4A94505890586CF2211E204BDE2F45F053C1A904FB5660AF6E658B023A",13,1503053819671,1504032920595,null,0,13,"66033CE52E968D72855641541227316AE4460FCCD0A3323B0DB67045B217A43DA95D75705E5E3A94C02CC80A20ECF01293DB22379571151375C8738A97BFECFC","AD087C790868AF801C3FFD64040E911CD4A8E1417559C8F380D3395ADA75A13A","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wUAAAAAAAAA",5,"MeshMS2","B83C88D908D4DFC548885FCDC301A4AEF1E4175B0E02F3B1EC4E80FF9596CB49",9,1503054045091,1504032920740,"48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34",1,9,"F5C5C2349EB58686B6327FCEF215C2B4D6749E91066981FAD61ADF9DE3E2FB893B2178DB9AD20D31E4B2D839AE049A9C42CA3939CAE96F5029D0D1D09001F53F","48FD5D58DD544BC8B2FF1E3AF58DCDA653868CA5328C2152CFBCC21344E4FF34","AD087C790868AF801C3FFD64040E911CD4A8E1417559C8F380D3395ADA75A13A",null],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wYAAAAAAAAA",6,"file","2BD64BF074A8B0250C72DA7446D580F4D69980C3B13587EAC932E63C256AFF12",1463371086659,1463371086659,1504032922565,null,0,2053808,"92BBF7DF11D232216332B6EC6DB9A24F2FCDCA0DE1575C9E15D58821654E329AA0175AD9F89A2C6C5AE19A86271E0ED0D2AD2231B58EB131C0DA7F970B5135E4",null,null,"Serval-0.93.apk"],\n' +
    '["8btTM3ehRv-4CQ0UGIsn_wcAAAAAAAAA",7,"MeshMS2","5CA2056356F2866BD50D0CEC67DC2ABFF9F57CDE93C18257E949581249D025F6",36,1503052779813,1504032983400,null,0,36,"44C9D89710A2A889CD1935D5D3934D76C2328D9E348D9FD06577ABA87B3C4484F9C14361FA2F4E2D6B501A64ED7D1022BD60A521C1EDD08B1E98DA380F0AFB6D","3B3695E5DBA2CA321A1ED008E662FB4A06603C63D458DB20ADCDE285908C834C","1C85B797DB7B4BCBFFBDE73E6BB93CEEB94FEF5E0AF58A8B9BEC289CBCCF0B73",null]\n' +
    ']\n' +
    '}\n';

/**
 * possible solution:
 * - end is ']]}' => fine! return this
 * else:
 * - find last ']' in string
 * - drop the rest
 * - add ']}'
 * - return result
 */


const JsonTools = require('../src/JsonTools');

require('mocha');
let expect = require('chai').expect;

describe('JsonTools', function() {
    describe('#checkAndRepairJsonBundleList()', function () {
        it('should return false for empty database', function () {
            let res = JsonTools.checkAndRepairJsonBundleList(incompleteJsonEmptyDatabase);
            expect(res).to.be.false;
        });
        it('should return array of json for incompleteJson OPEN END', function () {
            let res = JsonTools.checkAndRepairJsonBundleList(incompleteJsonOpenEnd);
            expect(res.length > 0).to.be.true;
        });
        it('should return array of json for incompleteJson OPEN END where line 0 has version property', function () {
            let res = JsonTools.checkAndRepairJsonBundleList(incompleteJsonOpenEnd);
            expect(res[0].hasOwnProperty('version')).to.be.true;
        });
        it('should return array of json for COMPLETE JSON where line 0 has version property', function () {
            let res = JsonTools.checkAndRepairJsonBundleList(completeJson);
            expect(res[0].hasOwnProperty('version')).to.be.true;
        });
        it('should fail for incomplete beginning', function () {
            let res = JsonTools.checkAndRepairJsonBundleList(incompleteJsonLostBeginning);
            expect(res[0].hasOwnProperty('version')).to.be.true;
        });

    });
});

// expect