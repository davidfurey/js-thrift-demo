var binary = require('./node_modules/thrift/lib/nodejs/lib/thrift/binary');

exports.IOSCustomReader = IOSCustomReader;

function IOSCustomReader(readBuffer, writeCb) {
  this.writeCb = writeCb;
  this.inBuf = readBuffer;
  this.readCursor = 0;
  console.log("[iOS] New transport")
};

IOSCustomReader.prototype.write = function(buf, foo) {
  console.log("[iOS] Transport write")
  this.writeCb(buf, 1)
}

IOSCustomReader.prototype.flush = function() {
  console.log("[iOS] Transport flush")
}

IOSCustomReader.prototype.borrow = function() {
  var cursor = this.readCursor;
  return {
    buf: this.inBuf,
    readIndex: this.readCursor,
    writeIndex: this.inBuf.length
  };
}

IOSCustomReader.prototype.ensureAvailable = function(len) {
  if (this.readCursor + len > this.inBuf.length) {
    throw("new InputBufferUnderrunError();");
  }
};

IOSCustomReader.prototype.consume = function(bytesConsumed) {
  this.readCursor += bytesConsumed;
};


IOSCustomReader.prototype.readByte = function() {
  this.ensureAvailable(1);
  return binary.readByte(this.inBuf[this.readCursor++]);
};

IOSCustomReader.prototype.readI16 = function() {
  this.ensureAvailable(2);
  var i16 = binary.readI16(this.inBuf, this.readCursor);
  this.readCursor += 2;
  return i16;
};

IOSCustomReader.prototype.readI32 = function() {
  this.ensureAvailable(4);
  var i32 = binary.readI32(this.inBuf, this.readCursor);
  this.readCursor += 4;
  return i32;
};

IOSCustomReader.prototype.readDouble = function() {
  this.ensureAvailable(8);
  var d = binary.readDouble(this.inBuf, this.readCursor);
  this.readCursor += 8;
  return d;
};

IOSCustomReader.prototype.readString = function(len) {
  this.ensureAvailable(len);
  var str = this.inBuf.toString('utf8', this.readCursor, this.readCursor + len);
  this.readCursor += len;
  return str;
};
