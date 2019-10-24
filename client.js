var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
var ttypes = require('./gen-nodejs/tutorial_types');
var JSCustomConnection = require("./JSCustomConnection").JSCustomConnection;
var JSCustomTransport = require("./JSCustomTransport").JSCustomTransport;
var IOSCustomServer = require("./IOSCustomServer").IOSCustomServer;

// Shared protocol
var protocol = thrift.TJSONProtocol
//var protocol = thrift.TBinaryProtocol

// --- "iOS" side
var handler = {
  ping: function(result) {
    console.log("ping()");
    setTimeout(() => {
        result(null);
    }, 1000);
  },

  add: function(n1, n2, result) {
    console.log("add(", n1, ",", n2, ")");
    setTimeout(() => {
        result(null, n1 + n2);
    }, 500 * Math.random());
  },
};

var server = new IOSCustomServer(Calculator, handler, receiveMessageJS, options = { protocol: protocol })

function receiveMessageIOS(buf) {
  console.log("[iOS] Receive Message")
  server.receiveMessage(buf)
}

// ----- JS side

var connection = new JSCustomConnection({ protocol: protocol}, receiveMessageIOS);

function receiveMessageJS(buf) {
  console.log("[JS] Receive Message");
  connection.rxMessage(new JSCustomTransport(new Buffer(buf)));
}


var client = thrift.createClient(Calculator, connection);

console.log("Try ping");
client.ping().then(function(response) {
  console.log('ping()');
});

console.log("Try 1+1");
client.add(1,1).then(function(response) {
  console.log("1+1=" + response);
});

console.log("Try 2+1");
client.add(2,1).then(function(response) {
  console.log("2+1=" + response);
});

console.log("Try 3+1");
client.add(3,1).then(function(response) {
  console.log("3+1=" + response);
});

setTimeout(() => {
    console.log("DONE")
    connection.end();
}, 5000);
