
// required libs stored in local folder: this makes sure, no interenet-connection is needed
// require("../roslibjs-develop/src/roslib.js");
require("./lib/eventemitter2.min.js");

const Util = require("util");
const ROSLIB = require("../roslibjs-develop/src/core/index");
const ComCenter = require("./CommandCenterMessageTypes");

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

module.exports.subscribeToDefaultTopic = function (messageHandlerCallback) {
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
};


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


function handleIncomingRosMessage(messageString) {

    // example:
    // UPDATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5
    // CREATE_FILE;/tmp/ugv001;filename=map.png;map_resolution=0.05;map_origin_pos_x=-2.5;map_origin_pos_y=-2.5

    console.log("Handling incoming ROS messageString: \n" + Util.inspect(messageString));

    let msgArray = messageString.split(";");

    let manifestAppendix = buildManifestAppendixFrom(msgArray, {beginAtLineOffset: 2});
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

function buildManifestAppendixFrom(msgArray, beginAtLineOffset){
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
        manifestAppendix += line + "\r\n";
    }
}