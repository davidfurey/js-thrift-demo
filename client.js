var thrift = require('thrift');
var Calculator = require('./gen-nodejs/Calculator');
var ttypes = require('./gen-nodejs/tutorial_types');
const assert = require('assert');
var JSCustomConnection = require("./JSCustomConnection").JSCustomConnection;
var IOSCustomReader = require("./IOSCustomReader").IOSCustomReader;
var IOSCustomWriter = require("./IOSCustomWriter").IOSCustomWriter;
var JSCustomReader = require("./JSCustomReader").JSCustomReader;
var SharedStruct = require("./gen-nodejs/shared_types").SharedStruct;

// Shared protocol
var protocol = thrift.TJSONProtocol
//var protocol = thrift.TBinaryProtocol

// --- "iOS" side
var data = {};

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

  calculate: function(logid, work, result) {
    console.log("calculate(", logid, ",", work, ")");

    var val = 0;
    if (work.op == ttypes.Operation.ADD) {
      val = work.num1 + work.num2;
    } else if (work.op === ttypes.Operation.SUBTRACT) {
      val = work.num1 - work.num2;
    } else if (work.op === ttypes.Operation.MULTIPLY) {
      val = work.num1 * work.num2;
    } else if (work.op === ttypes.Operation.DIVIDE) {
      if (work.num2 === 0) {
        var x = new ttypes.InvalidOperation();
        x.whatOp = work.op;
        x.why = 'Cannot divide by 0';
        result(x);
        return;
      }
      val = work.num1 / work.num2;
    } else {
      var x = new ttypes.InvalidOperation();
      x.whatOp = work.op;
      x.why = 'Invalid operation';
      result(x);
      return;
    }

    var entry = new SharedStruct();
    entry.key = logid;
    entry.value = ""+val;
    data[logid] = entry;

    result(null, val);
  },

  getStruct: function(key, result) {
    console.log("getStruct(", key, ")");
    result(null, data[key]);
  },

  zip: function() {
    console.log("zip()");
  }

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


// work = new ttypes.Work();
// work.op = ttypes.Operation.DIVIDE;
// work.num1 = 1;
// work.num2 = 0;
//
// client.calculate(1, work, function(err, message) {
//   if (err) {
//     console.log("InvalidOperation " + err);
//   } else {
//     console.log('Whoa? You know how to divide by zero?');
//   }
// });
//
// work.op = ttypes.Operation.SUBTRACT;
// work.num1 = 15;
// work.num2 = 10;
//
// client.calculate(1, work, function(err, message) {
//   console.log('15-10=' + message);
//
//   client.getStruct(1, function(err, message){
//     console.log('Check log: ' + message.value);
//
//     //close the connection once we're done
//     setTimeout(() => {
//         console.log("DONE")
//         connection.end();
//     }, 5000);
//   });
// });
setTimeout(() => {
    console.log("DONE")
    connection.end();
}, 5000);
