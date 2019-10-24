exports.JSCustomWriter = JSCustomWriter;

function JSCustomWriter(unknown, writeCb) {
  console.log("[JS] New JSCustomWriter")
  this.writeCb = writeCb
  this.buffers = [];
};

JSCustomWriter.prototype.write = function(buf, foo) {
  console.log("[JS] Writer write")
  this.buffers.push(new Buffer(buf));
}

JSCustomWriter.prototype.flush = function() {
  console.log("[JS] Writer flush")
  this.writeCb(Buffer.concat(this.buffers), 1)
  this.buffers = []
}

JSCustomWriter.prototype.setCurrSeqId = function (id) {
  // todo
}
