/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */

const Util = require("util");
const Serval = require('./ServalMessages');
const ComCenter = require('./CommandCenterMessageTypes');
const ObjComp = require('./ObjectsComparison');

// check every 5 seconds
let intervalInMs = 5000;

//const RosMsg = require('./MessageToROS');
//RosMsg.subscribeToDefaultTopic();
const blankManifest = ComCenter.blankManifest;
const blankBundle = ComCenter.blankBundle;

Serval.insertDefaultRhizomeBundleWith("DemoContent" + Date.now());


// bundlelist polling loop
let pollingClient = setInterval(() => {

    Serval.simplifiedGetVeryLatestBundleID().then((latestBundleID) => {
        console.log("\nDONE GETTING BUNDLEID\n");

        Serval.getBundle(latestBundleID).then( (res) => {
            console.log("\nDONE GETTING BUNDLE CONTENT\n");

            // TODO: try catch
            validateAndRespondTo(res);
        });
    });

}, intervalInMs);


function validateAndRespondTo(res) {
    let veryLatestBundlePayload = res;

    if (!veryLatestBundlePayload) {
        // not a ros-message => possibly something else
        console.log("**************** Received wrong or empty message: " + veryLatestBundlePayload);

    } else {
        // in case it is message to ros
        console.log("**************** Would now send msg to robot: " + veryLatestBundlePayload);
        // RosMsg.sendMsgToRobot(whatever) // TODO: create this

    }
}

