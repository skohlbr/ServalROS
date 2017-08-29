/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */

const Util = require("util");
const RosMsg = require('./MessageToROS');
const Serval = require('./InsertIntoServal');

// RosMsg.subscribeToDefaultTopic(handleIncomingRosMessage);
// RosMsg.moveToGoalPoseForPhoto(12,34,56);

let stopFlag = false;
//RosMsg.connectToRos();


// check every 5 seconds
let intervalInMs = 5000;

RosMsg.subscribeToDefaultTopic();

// bundlelist polling loop
let pollingClient = setInterval(() => {
    Serval.getLatestBundle().then((latestBundle) => {
        console.log("\n" + Date.now() + ":\n" + Util.inspect(latestBundle));

        if (!newMsg) {
            // not a ros-message => possibly something else
        } else {
            // in case it is message to ros
            RosMsg.sendMsgToRobot(whatever) // TODO: create this

        }
    })
}, intervalInMs);

