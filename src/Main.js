/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */


const Util = require("util");
let example = require('./MessageToROS');


example.subscribeToDefaultTopic(handleIncomingRosMessage);
example.moveToGoalPoseForPhoto(12,34,56);


function handleIncomingRosMessage(message) {
    console.log("Handling incoming ROS message: \n" + Util.inspect(message));

    // do stuff
}

