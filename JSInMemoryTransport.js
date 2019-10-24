
exports.JSInMemoryTransport = JSInMemoryTransport;

// var writeCb = function(buf, seqid) {
//   connection.write(buf, seqid);
// };
function JSInMemoryTransport(unknown, writeCb) {
  this.writeCb = writeCb
  this.buffers = [];
  console.log("[JS] New InMemoryTransport")
};

JSInMemoryTransport.prototype.write = function(buf, foo) {
  //this.writeCb(new Buffer(buf), 1)
  this.buffers.push(new Buffer(buf));
}

JSInMemoryTransport.prototype.flush = function() {
  console.log("[JS] JSInMemoryTransport flush")
  this.writeCb(Buffer.concat(this.buffers), 1)
  this.buffers = []
}

JSInMemoryTransport.prototype.setCurrSeqId = function (id) {
  // todo
}
