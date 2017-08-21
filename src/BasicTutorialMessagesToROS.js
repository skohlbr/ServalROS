/** Script adopted from RosBridge Tutorial
 * http://wiki.ros.org/roslibjs/Tutorials/BasicRosFunctionality
 */

// required libs should be stored in local folder: this makes sure, no internet-connection is needed
require("./lib/eventemitter2.min.js"); // http://cdn.robotwebtools.org/EventEmitter2/current/eventemitter2.min.js
require("./lib/roslib.min.js"); // http://cdn.robotwebtools.org/roslibjs/current/roslib.min.js

// Connecting to ROS
// -----------------

module.exports.demoCreateServer = function demoCreateServer() {

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

    return ros;
};

// Publishing a Topic
// ------------------
module.exports.demoPubTopic = function demoPubTopic() {
    let cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
    });

    let twist = new ROSLIB.Message({
        linear : {
            x : 0.1,
            y : 0.2,
            z : 0.3
        },
        angular : {
            x : -0.1,
            y : -0.2,
            z : -0.3
        }
    });
    cmdVel.publish(twist);
};

// Subscribing to a Topic
// ----------------------

module.exports.demoSubscribeToTopic = function demoSubscribeToTopic() {
    let listener = new ROSLIB.Topic({
        ros : ros,
        name : '/listener',
        messageType : 'std_msgs/String'
    });

    listener.subscribe(function(message) {
        console.log('Received message on ' + listener.name + ': ' + message.data);
        listener.unsubscribe();
    });
};

// Calling a service
// -----------------

module.exports.demoCallAService = function demoCallAService() {
    let addTwoIntsClient = new ROSLIB.Service({
        ros : ros,
        name : '/add_two_ints',
        serviceType : 'rospy_tutorials/AddTwoInts'
    });

    let request = new ROSLIB.ServiceRequest({
        a : 1,
        b : 2
    });

    addTwoIntsClient.callService(request, function(result) {
        console.log('Result for service call on '
            + addTwoIntsClient.name
            + ': '
            + result.sum);
    });
};

// Getting and setting a param value
// ---------------------------------

module.exports.demoGetSetParams = function demoGetSetParams() {
    ros.getParams(function(params) {
        console.log(params);
    });

    let maxVelX = new ROSLIB.Param({
        ros : ros,
        name : 'max_vel_y'
    });

    maxVelX.set(0.8);
    maxVelX.get(function(value) {
        console.log('MAX VAL: ' + value);
    });
};

