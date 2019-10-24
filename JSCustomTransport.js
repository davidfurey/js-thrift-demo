var binary = require('./node_modules/thrift/lib/nodejs/lib/thrift/binary');

exports.JSCustomTransport = JSCustomTransport;

function JSCustomTransport(readBuffer, writeCb) {
  console.log("[JS] New JSCustomTransport")
  this.writeCb = writeCb;
  this.buffers = [];
  this.inBuf = readBuffer;
  this.readCursor = 0;
};

JSCustomTransport.prototype.write = function(buf, foo) {
  console.log("[JS] Writer write")
  if (typeof(buf) === "string") {
    buf = new Buffer(buf, 'utf8');
  }
  this.buffers.push(buf);
}

JSCustomTransport.prototype.flush = function() {
  console.log("[JS] Writer flush")
  this.writeCb(Buffer.concat(this.buffers))
  this.buffers = []
}

JSCustomTransport.prototype.setCurrSeqId = function (id) {
  // todo
}

JSCustomTransport.prototype.borrow = function() {
  var cursor = this.readCursor;
  return {
    buf: this.inBuf,
    readIndex: this.readCursor,
    writeIndex: this.inBuf.length
  };
}

JSCustomTransport.prototype.commitPosition = function() {
  // todo
}

JSCustomTransport.prototype.ensureAvailable = function(len) {
  if (this.readCursor + len > this.inBuf.length) {
    throw("new InputBufferUnderrunError();");
  }
};

JSCustomTransport.prototype.consume = function(bytesConsumed) {
  this.readCursor += bytesConsumed;
};


JSCustomTransport.prototype.readByte = function() {
  this.ensureAvailable(1);
  return binary.readByte(this.inBuf[this.readCursor++]);
};

JSCustomTransport.prototype.readI16 = function() {
  this.ensureAvailable(2);
  var i16 = binary.readI16(this.inBuf, this.readCursor);
  this.readCursor += 2;
  return i16;
};

JSCustomTransport.prototype.readI32 = function() {
  this.ensureAvailable(4);
  var i32 = binary.readI32(this.inBuf, this.readCursor);
  this.readCursor += 4;
  return i32;
};

JSCustomTransport.prototype.readDouble = function() {
  this.ensureAvailable(8);
  var d = binary.readDouble(this.inBuf, this.readCursor);
  this.readCursor += 8;
  return d;
};

JSCustomTransport.prototype.readString = function(len) {
  this.ensureAvailable(len);
  var str = this.inBuf.toString('utf8', this.readCursor, this.readCursor + len);
  this.readCursor += len;
  return str;
};
