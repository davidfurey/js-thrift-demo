var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
var ttypes = require('./gen-nodejs/tutorial_types');
var JSCustomConnection = require("./JSCustomConnection").JSCustomConnection;
var IOSCustomReader = require("./IOSCustomReader").IOSCustomReader;
var IOSCustomWriter = require("./IOSCustomWriter").IOSCustomWriter;
var JSCustomReader = require("./JSCustomReader").JSCustomReader;

// Shared protocol
var protocol = thrift.TJSONProtocol
//var protocol = thrift.TBinaryProtocol

// --- "iOS" side
var processor = new Calculator.Processor({
  ping: function(result) {
    console.log("ping()");
    setTimeout(() => {
        result(null);
    }, 1000);
  },

  add: function(n1, n2, result) {
    console.log("add(", n1, ",", n2, ")");
    //result(null, n1 + n2);
    setTimeout(() => {
        result(null, n1 + n2);
    }, 500 * Math.random());
  },
});

function receiveMessageIOS(buf) {
  console.log("[iOS] Receive Message")
  // probably shouldn't create a new protocol and transport every time
  processor.process(new protocol(new IOSCustomReader(buf), ""), new protocol(new IOSCustomWriter(receiveMessageJS)))
}


// ----- JS side

var connection = new JSCustomConnection({ protocol: protocol}, receiveMessageIOS);

function receiveMessageJS(buf) {
  console.log("[JS] Receive Message");
  connection.rxMessage(new JSCustomReader(new Buffer(buf)));
}


var client = thrift.createClient(Calculator, connection);


console.log("Try ping");
client.ping(function(err, response) {
  console.log('ping()');
});


console.log("Try 1+1");
client.add(1,1, function(err, response) {
  console.log("1+1=" + response);
});

console.log("Try 2+1");
client.add(2,1, function(err, response) {
  console.log("2+1=" + response);
});

console.log("Try 1+1");
client.add(3,1, function(err, response) {
  console.log("3+1=" + response);
});

setTimeout(() => {
    console.log("DONE")
    connection.end();
}, 5000);
