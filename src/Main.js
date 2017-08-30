/** ServalROS
 * Offers a interface from ros to serval and back
 *
 */

const Serval = require('./ServalMessages');
const RosMsg  = require('./RosMessages');

// check every 5 seconds
let intervalInMs = 5000;

RosMsg.subscribeToDefaultTopic();

// setInterval(() => {
    Serval.insertDefaultRhizomeBundleWith("", "DemoContent" + Date.now());
//}, intervalInMs * 1.7);

// bundlelist polling loop
setInterval(() => {

    Serval.simplifiedGetVeryLatestBundleID().then((latestBundleID) => {
        console.log("DONE GETTING BUNDLEID");
        if (latestBundleID === 0) {
            console.log("ALL BUNDLES PROCESSED - NOTHING TO DO");
        } else {
            Serval.getBundle(latestBundleID).then( (res) => {
                console.log("DONE GETTING BUNDLE CONTENT");

                try {
                    RosMsg.validateAndPassMessageToROS(res);
                } catch (e){
                    console.log("RosMsg.validateAndPassMessageToROS: Something went wrong:");
                    console.log(e.message);
                }
            });
        }
    });

}, intervalInMs);
