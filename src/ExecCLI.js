/**
 * Created by ichtm on 03.06.2017.
 */

let exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout){ callback(stdout); });
}

module.exports = {
    getImages: function (commandString, callback) {
        execute(commandString, function (stdoutResult) {
            callback({stdoutResult: stdoutResult});
        });
    }
};
