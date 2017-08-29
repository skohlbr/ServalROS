// RhizomeGET.getBundle("CC33880E952D5A2837A639A65FBD65D609FC7C0DF8D0D788BA9D94EE57B2A3F7");
const Serval = require('./InsertIntoServal');
const Util = require("util");

/*
let i = 0 ;
while (i < 10) {
    Rhizome.insertDefaultRhizomeBundle('{messageType:"echotest", messageText:"This is a echo-test! ' + Date.now() + ":" + i + '"}');
    i = i+1;
    console.log("Increasing i to " + i);
}

*/

// Test runs including keyring retrieval for each insertion:
// Test 1:
//   10 insertions: max 350 ms, min 60 ms, avg 100 ms

// Test 2:
//  100 insertions: max 600 ms, min 69 ms, avg 93 ms , occupied about 280 kb in Database

// Test 3:
// transmit to peers:
// - bad connection: transmits 40 random messages out of 100 and stops transmitting
// - good connection: transmits all 100 within seconds
