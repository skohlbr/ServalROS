/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */


const Util = require("util");
const RosMsg = require('./MessageToROS');
const Serval = require('./InsertIntoServal');

RosMsg.subscribeToDefaultTopic(handleIncomingRosMessage);
RosMsg.moveToGoalPoseForPhoto(12,34,56);


function handleIncomingRosMessage(messageString) {

    // example:
    // UPDATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5
    // CREATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5

    console.log("Handling incoming ROS messageString: \n" + Util.inspect(messageString));

    let msgArray = messageString.split(";");

    let manifestAppendix = buildManifestAppendixFrom(msgArray);
    if (!manifestAppendix) {return false}

    let command = msgArray[0];
    let path = msgArray[1];
    let filename = msgArray[2];

    switch (command)  {
        // TODO: Build these methods
        case "UPDATE_FILE" : Serval.updateFileRhizomeBundle(path, filename, manifestAppendix); break;
        case "CREATE_FILE" : Serval.insertFileRhizomeBundle(path, filename, manifestAppendix); break;
        default : return false
    }

    // TODO: use different insert-call that allows to modify manifest
    Serval.insertDefaultRhizomeBundle(messageString);

}

function buildManifestAppendixFrom(msgArray){
    let aLen = msgArray.length;
    if (aLen <= 0) {return false}

    let msgAppendixArray = [];
    let i = 0;
    while (i < (aLen - 2)) {
        msgAppendixArray[i] = msgArray[i + 2];
        i = i + 1;
    }

    let manifestAppendix = "";
    for (let line in msgAppendixArray) {
        manifestAppendix += line + "\r\n";
    }
}


