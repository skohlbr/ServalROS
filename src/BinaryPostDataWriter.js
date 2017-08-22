/**
 * Created by ichtm on 01.06.2017.
 */

// adapted from https://stackoverflow.com/questions/37712081/uploading-a-file-with-node-http-module

module.exports = {
    writeBinaryPostData:function writeBinaryPostData(request, filepath) {
        let fs = require('fs'),
            data = fs.readFileSync(filepath);

        let crlf = "\r\n",
            boundaryKey = Math.random().toString(16),
            boundary = `--${boundaryKey}`,
            delimeter = `${crlf}--${boundary}`,
            headers = [
                'Content-Disposition: form-data; name="file"; filename="usr123456.json"' + crlf
            ],
            closeDelimeter = `${delimeter}--`,
            multipartBody;


        multipartBody = Buffer.concat([
            new Buffer(delimeter + crlf + headers.join('') + crlf),
            data,
            new Buffer(closeDelimeter)]
        );

        request.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        request.setHeader('Content-Length', multipartBody.length);

        request.write(multipartBody);
        request.end();
    }
};