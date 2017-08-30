
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
module.exports.blankPose = blankPose;


module.exports.isValidRosLibMessage=function (incomingMessage) {

    // TODO: use ObjComp on all relevant RosLib-messages and their templates to yield robust messaging
    // ObjComp.validateObjectHasStructure( allThetemplateRosLibMessages, testString)

    if (!incomingMessage) {
        // not a ros-message => possibly something else
        console.log("**************** Received wrong or empty message: \n" + incomingMessage);
    }
    return true; // TODO: return or map correct type
};


module.exports.createMoveToGoalPoseForPhoto = function (x, y, z) {
    let newPose = RosMsgTypes.blankPose;

    newPose.pose.position.x = x;
    newPose.pose.position.y = y;
    newPose.pose.position.z = z;

    //console.log('moveToGoalPoseForPhoto yields newPose:\n' + Util.inspect(newPose));
    return newPose
};

module.exports.createMoveToGoalPoseTarget = function (x, y, yaw) {
    let newPose = RosMsgTypes.blankPose;

    newPose.pose.orientation.x = x;
    newPose.pose.orientation.y = y;
    newPose.orientation.w = Math.cos(yaw * 0.5);
    newPose.orientation.z = Math.sin(yaw * 0.5);

    //console.log('moveToGoalPoseTarget yields newPose:\n' + Util.inspect(newPose));
    return newPose
};