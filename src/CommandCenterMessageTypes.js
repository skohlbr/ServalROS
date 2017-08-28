module.exports.EmptyRosPhotoMessage = {command: "", path: "", filename:"", manifestAppendix:""};

module.exports.MoveToCommand=
    {
        "messageType" : "move-to",
        "loc" : {
            "lat" : 49.87746,
            "lng" : 8.65441
        },
        "timestamp" : 1503521061187,
        "uuid" : "566cbfb1-1650-4089-a869-ed2fdb921c81",
        "target" : {
            "x" : 0.9,
            "y" : 1.0,
            "z" : 1.1
        }
    };


module.exports.TakePhotoCommand=

    {
        "messageType" : "take-photo",
        "loc" : {
            "lat" : 49.87746,
            "lng" : 8.65441
        },
        "description" : "Some desc",
        "timestamp" : 1503521061187,
        "uuid" : "566cbfb1-1650-4089-a869-ed2fdb921c81",
        "target" : {
            "x" : 0.9,
            "y" : 1.0,
            "z" : 1.1
        }
    };


module.exports.IndoorMap=

    {
        "messageType" : "indoor-map",
        "loc" : {
            "lat" : 49.87746,
            "lng" : 8.65441
        },
        "anchor" : {
            "x" : 0,
            "y" : 0
        },
        "scale" : 1.1,
        "angle" : 270.123,
        "file" : {
            "mimeType" : "image/png",
            "content" : "4AAQSkZJRgABAgAAAQABAA..."
        },
        "timestamp" : 1503521061187,
        "uuid" : "566cbfb1-1650-4089-a869-ed2fdb921c81"
    };


module.exports.Photo=

    {
        "messageType" : "photo",
        "uuid" : "4486f35d-ee18-4686-a1cc-820ce24bf4be",
        "replyToUUID" : "566cbfb1-1650-4089-a869-ed2fdb921c81",
        "loc" : {
            "lat" : 49.87746,
            "lng" : 8.65441
        },
        "timestamp" : 1503521061187,
        "file" : {
            "mimeType" : "image/png",
            "content" : "4AAQSkZJRgABAgAAAQABAA..."
        }
    };


module.exports.Geolocation=

    {
        "messageType" : "geolocation",
        "loc" : {
            "lat" : 49.87746,
            "lng" : 8.65441
        },
        "timestamp" : 1503521061187,
        "uuid" : "4486f35d-ee18-4686-a1cc-820ce24bf4be"
    };
