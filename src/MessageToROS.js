/** Script adopted from RosBridge Tutorial
 * http://wiki.ros.org/roslibjs/Tutorials/BasicRosFunctionality
 *
 * Interfaces
 *  From robot:
 *      Grid map with metadata regarding origin:
 *          http://docs.ros.org/jade/api/nav_msgs/html/msg/OccupancyGrid.html
 *      Images:
 *          http://docs.ros.org/api/sensor_msgs/html/msg/Image.html
 *      Pose updates from robot (indoor)
 *          http://docs.ros.org/api/geometry_msgs/html/msg/PoseStamped.html
 *  To robot:
 *      Move to goal pose:
 *          http://docs.ros.org/api/geometry_msgs/html/msg/PoseStamped.html
 *          3D components ignored (x, y, yaw used)
 *      Target pose for taking photo:
 *          http://docs.ros.org/api/geometry_msgs/html/msg/PoseStamped.html
 *          3D position used (orientation ignored)
 */

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

// INCOMING MESSAGE
function exampleIncomingImageMessage(msg) {
    ROSLIB.Topic({ // should be
        ros : ros,
        name : '/camera/image', // Topic Name goes here
        messageType : 'sensor_msgs/Image'
    });

    let twist = new ROSLIB.Message(
        // http://docs.ros.org/api/sensor_msgs/html/msg/Image.html

    );
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
            w : 0
        }
    }
};



// OUTGOING MESSAGE to robot
module.exports.exampleMoveToGoalPosition = function exampleMoveToGoalPosition() {
    let newPose = blankPose;

    newPose.pose.position.x = 123;
    newPose.pose.position.y = 456;
    newPose.pose.position.z = 789;

    moveToGoalPose(newPose);
};

module.exports.exampleMoveToGoalOrientation = function exampleMoveToGoalOrientation() {
    let newPose = blankPose;

    newPose.pose.orientation.x = 123;
    newPose.pose.orientation.y = 456;
    newPose.pose.orientation.z = 789;
    newPose.pose.orientation.w = 321;

    moveToGoalPose(newPose);
};

function moveToGoalPose(poseCoords) {
    let cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel', // Topic Name goes here
        messageType : 'geometry_msgs/PoseStamped'
    });

    let goalPoseMsg = new ROSLIB.Message(pose);
    cmdVel.publish(goalPoseMsg);
}

