
// required libs stored in local folder: this makes sure, no interenet-connection is needed
// require("../roslibjs-develop/src/roslib.js");
require("./lib/eventemitter2.min.js");

const Util = require("util");
const ROSLIB = require("../roslibjs-develop/src/core/index");
const ComCenterMsg = require("./CommandCenterMessageTypes");
const Serval = require('./ServalMessages');
const Manifest = require('./ServalManifestBuilders');
const ObjComp = require('./ObjectsComparison');
const RosMsgTypes = require('./RosMessageTypes');

// Connecting to ROS
// -----------------

let ros = new ROSLIB.Ros({
    url : 'ws://10.0.0.102:9091' // Robot ip address
});

ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});


// SUBSCRIBE & LISTEN
function subscribeToDefaultTopic() {
    subscribeToDefaultTopicWithCallback(handleIncomingRosToServalMessage);
}
module.exports.subscribeToDefaultTopic = subscribeToDefaultTopic;

function subscribeToDefaultTopicWithCallback(messageHandlerCallback) {
    let listener = new ROSLIB.Topic({
        ros : ros,
        name : '/serval_update',
        messageType : 'std_msgs/String'
    });

    listener.subscribe(function(message) {
        console.log('Received message on ' + listener.name + ': ' + message.data);

        messageHandlerCallback(message.data);
        listener.unsubscribe();
    });
}


// OUTGOING MESSAGE to robot
function decideCommandToSendToROS(incomingMessageFromServal) {


    // TODO: distinguish message-type etc. and decide which message to send to ROS
    if (incomingMessageFromServal) {
        moveToGoalPose(RosMsgTypes.blankPose);
    }
}

module.exports.validateAndPassMessageToROS = function (incomingMessage) {

        if (RosMsgTypes.isValidRosLibMessage(incomingMessage)) {
            console.log("Would now send msg to robot: \n" + incomingMessage);
            decideCommandToSendToROS(incomingMessage); // TODO: create this
        } else {
            console.log("**************** Received a message, which is possibly not for ROS: \n" + incomingMessage);
        }
};


function moveToGoalPose(pose) {
    let cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/move_base/simple_goal', // Topic Name goes here
        messageType : 'geometry_msgs/PoseStamped'
    });

    let goalPoseMsg = new ROSLIB.Message(pose);
    cmdVel.publish(goalPoseMsg);
}


// INCOMING MESSAGE FROM ROS TO SERVAL
function handleIncomingRosToServalMessage(messageString) {
    let newMsg;
    try {
        newMsg = parseRosToServalMessageWithManifest(messageString);
    } catch(e){
        console.log(e);
        return false
    }
    if (!newMsg) {return false}

    switch (newMsg.command)  {

        case "UPDATE_FILE" : Serval.updateFileRhizomeBundle(newMsg); break;
        case "CREATE_FILE" : Serval.insertFileRhizomeBundle(newMsg); break;
        default : return false
    }
}

function parseRosToServalMessageWithManifest(messageString) {
    // console.log("Handling incoming ROS messageString: \n" + Util.inspect(messageString));
    let newMsg = ComCenterMsg.EmptyIncomingRosPhotoMessage;
    let msgArray = messageString.split(";");

    newMsg.manifestAppendix = Manifest.buildManifestAppendixFrom(msgArray, 2);
    if (!newMsg.manifestAppendix) {return false}

    newMsg.command = msgArray[0];
    newMsg.path = msgArray[1];
    newMsg.filename = msgArray[2];
    return newMsg;
}

module.exports.parseMessage = parseRosToServalMessageWithManifest;
module.exports.handleIncomingRosMessage = handleIncomingRosToServalMessage;
