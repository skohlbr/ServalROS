/**
 * Created by ichtm on 31.05.2017.
 */

/* Use it like this:

function writeFile() {

    // let writer = require('./WriteToFile.js')
    // writer.writeToFile("This is some test text: " + method + url + headers + ":: Awesome, right?");
}
*/


module.exports =
{
    writeToFile: function writeToFile(content, filename) {
        let fs = require('fs');
        let targetFile = filename;
        fs.writeFile(targetFile, content, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("File was written!");
            return true;
        });
    }
};