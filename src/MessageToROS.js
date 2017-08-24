
// required libs stored in local folder: this makes sure, no interenet-connection is needed
// require("../roslibjs-develop/src/roslib.js");
require("./lib/eventemitter2.min.js");

const Util = require("util");
const ROSLIB = require("../roslibjs-develop/src/core/index");
const ComCenter = require("./ComCenterMessageTypes");

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

