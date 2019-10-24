var EventEmitter = require("events").EventEmitter;
var thrift = require('thrift');

var JSInMemoryTransport = require("./JSInMemoryTransport").JSInMemoryTransport;

exports.JSCustomConnection = JSCustomConnection;

function JSCustomConnection(options = {}, iosFunction) {
  this.transport = options.transport || JSInMemoryTransport;
  this.protocol = options.protocol || thrift.TJSONProtocol;
  this.iosFunction = iosFunction;
  this.client = null;
};


JSCustomConnection.prototype.write = function(buf, arg) {
  console.log("[JS] JSCustomConnection write")
  this.iosFunction(buf)
};

JSCustomConnection.prototype.rxMessage = function(transport_with_data) {
  console.log("[JS] RX Message")
  var message = new this.protocol(transport_with_data);
  var header = message.readMessageBegin();
  var dummy_seqid = header.rseqid * -1;
  var client = this.client;
  client._reqs[dummy_seqid] = function(err, success){
    transport_with_data.commitPosition();

    var callback = client._reqs[header.rseqid];
    delete client._reqs[header.rseqid];
    if (callback) {
      callback(err, success);
    }
  };
  /*jshint +W083 */

  if(client['recv_' + header.fname]) {
    client['recv_' + header.fname](message, header.mtype, dummy_seqid);
  } else {
    delete client._reqs[dummy_seqid];
    throw("Received a response to an unknown RPC function");
  }
}

JSCustomConnection.prototype.end = function() {
  // todo
}
