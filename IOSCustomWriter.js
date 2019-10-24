exports.IOSCustomWriter = IOSCustomWriter;

function IOSCustomWriter(writeCb) {
  console.log("[iOS] New IOSCustomWriter")
  this.writeCb = writeCb
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
  this.writeCb(Buffer.concat(this.buffers))
  this.buffers = []
}

IOSCustomWriter.prototype.setCurrSeqId = function (id) {
  // todo
}
