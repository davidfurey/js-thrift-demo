
exports.IOSCustomWriter = IOSCustomWriter;

// var writeCb = function(buf, seqid) {
//   connection.write(buf, seqid);
// };
function IOSCustomWriter(receiveMessageJS) {
  console.log("[iOS] New IOS Writer")
  this.receiveMessageJS = receiveMessageJS
  this.writeBuf = null
  this.buffers = [];
};

IOSCustomWriter.prototype.write = function(buf, foo) {
  console.log("[iOS] Writer write")
  if (typeof(buf) === "string") {
    buf = new Buffer(buf, 'utf8');
  }
  this.buffers.push(buf);
}

IOSCustomWriter.prototype.flush = function() {
  console.log("[iOS] Writer flush")
  this.receiveMessageJS(Buffer.concat(this.buffers))
  this.buffers = []
}

IOSCustomWriter.prototype.setCurrSeqId = function (id) {
  // todo
}
