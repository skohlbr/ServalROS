
// required libs stored in local folder: this makes sure, no interenet-connection is needed
// require("../roslibjs-develop/src/roslib.js");
require("./lib/eventemitter2.min.js");

const Util = require("util");
const ROSLIB = require("../roslibjs-develop/src/core/index");
const ComCenterMsg = require("./CommandCenterMessageTypes");
const Serval = require('./InsertIntoServal');

// Connecting to ROS
// -----------------

let ros = new ROSLIB.Ros({
    url : 'ws://localhost:9091'
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
        name : '/listener',
        messageType : 'std_msgs/String'
    });

    listener.subscribe(function(message) {
        console.log('Received message on ' + listener.name + ': ' + message.data);
        messageHandlerCallback(message.data);
        listener.unsubscribe(); // TODO: is this necessary??
    });
}


const blankPose = {
    pose : {
        position : {
            x : 0,
            y : 0,
            z : 0
        },
        orientation : {
            x : 0,
            y : 0,
            z : 0,
            w : 1
        }
    }
};

// OUTGOING MESSAGE to robot
module.exports.moveToGoalPoseForPhoto = function (x, y, z) {
    let newPose = blankPose;

    newPose.pose.position.x = x;
    newPose.pose.position.y = y;
    newPose.pose.position.z = z;

    console.log('moveToGoalPoseForPhoto yields newPose:\n' + Util.inspect(newPose));
    moveToGoalPose(newPose);
};

module.exports.moveToGoalPoseTarget = function (x, y, yaw) {
    let newPose = blankPose;

    newPose.pose.orientation.x = x;
    newPose.pose.orientation.y = y;
    newPose.orientation.w = Math.cos(yaw * 0.5);
    newPose.orientation.z = Math.sin(yaw * 0.5);

    console.log('moveToGoalPoseTarget yields newPose:\n' + Util.inspect(newPose));
    moveToGoalPose(newPose);
};

function moveToGoalPose(pose) {
    let cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel', // Topic Name goes here
        messageType : 'geometry_msgs/PoseStamped'
    });

    let goalPoseMsg = new ROSLIB.Message(pose);
    cmdVel.publish(goalPoseMsg);
}

function parseMessage(messageString) {
    // console.log("Handling incoming ROS messageString: \n" + Util.inspect(messageString));
    let newMsg = ComCenterMsg.EmptyIncomingRosPhotoMessage;
    let msgArray = messageString.split(";");

    newMsg.manifestAppendix = buildManifestAppendixFrom(msgArray, 2);
    if (!newMsg.manifestAppendix) {return false}

    newMsg.command = msgArray[0];
    newMsg.path = msgArray[1];
    newMsg.filename = msgArray[2];
    return newMsg;
}

function buildManifestAppendixFrom(msgArray, beginAtLineOffset){
    if (!Array.isArray(msgArray)) {return false}
    let aLen = msgArray.length;
    if (aLen <= 0) {return false}

    let msgAppendixArray = [];
    let i = 0;
    while (i < (aLen - beginAtLineOffset)) {
        msgAppendixArray[i] = msgArray[i + beginAtLineOffset];
        i = i + 1;
    }

    let manifestAppendix = "";
    for (let line in msgAppendixArray) {
        manifestAppendix += msgAppendixArray[line] + "\r\n";
    }
    return manifestAppendix;
}


function handleIncomingRosToServalMessage(messageString) {

    let newMsg = parseMessage(messageString);
    if (!newMsg) {return false}

    switch (newMsg.command)  {

        case "UPDATE_FILE" : Serval.updateFileRhizomeBundle(newMsg); break;
        case "CREATE_FILE" : Serval.insertFileRhizomeBundle(newMsg); break;
        default : return false
    }
}

module.exports.parseMessage = parseMessage;
module.exports.handleIncomingRosMessage = handleIncomingRosToServalMessage;