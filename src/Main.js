/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */

const Util = require("util");
const RosMsg = require('./MessageToROS');
const Serval = require('./InsertIntoServal');
const ComCenter = require('./CommandCenterMessageTypes');
const ObjComp = require('./ObjectsComparison');

// check every 5 seconds
let intervalInMs = 5000;

RosMsg.subscribeToDefaultTopic();
const blankBundle = CommandCenter.blankBundle;

// bundlelist polling loop
let pollingClient = setInterval(() => {
    Serval.getLatestBundle().then((latestBundle) => {
        ObjComp.validateObjectHasStructure(blankBundle, latestBundle);

        console.log("\n" + Date.now() + ":\n" + Util.inspect(latestBundle));

        let newMsg = latestBundle.payload;

        if (!newMsg) {
            // not a ros-message => possibly something else
        } else {
            // in case it is message to ros
            RosMsg.sendMsgToRobot(whatever) // TODO: create this

        }
    })
}, intervalInMs);

