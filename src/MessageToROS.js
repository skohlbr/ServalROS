
// required libs stored in local folder: this makes sure, no interenet-connection is needed
require("./lib/eventemitter2.min.js");
require("./lib/roslib.min.js");

// Connecting to ROS
// -----------------

let ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
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
            w : 0
        }
    }
};

// OUTGOING MESSAGE to robot
module.exports.moveToGoalPosition = function (x, y, z) {
    let newPose = blankPose;

    newPose.pose.position.x = x;
    newPose.pose.position.y = y;
    newPose.pose.position.z = z;

    moveToGoalPose(newPose);
};

module.exports.moveToGoalOrientation = function (x, y, z, w) {
    let newPose = blankPose;

    newPose.pose.orientation.x = x;
    newPose.pose.orientation.y = y;
    newPose.pose.orientation.z = z;
    newPose.pose.orientation.w = w;

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

