var binary = require('./node_modules/thrift/lib/nodejs/lib/thrift/binary');

exports.JSCustomReader = JSCustomReader;

function JSCustomReader(readBuffer, writeCb) {
  this.writeCb = writeCb;
  this.inBuf = readBuffer;
  this.readCursor = 0;
  console.log("[JS] New JS Reader")
};

JSCustomReader.prototype.write = function(buf, foo) {
  console.log("[JS] Reader write")
  this.writeCb(buf, 1)
}

JSCustomReader.prototype.flush = function() {
  console.log("[JS] Reader flush")
}

JSCustomReader.prototype.borrow = function() {
  var cursor = this.readCursor;
  return {
    buf: this.inBuf,
    readIndex: this.readCursor,
    writeIndex: this.inBuf.length
  };
}

JSCustomReader.prototype.commitPosition = function() {
  // todo
}

JSCustomReader.prototype.ensureAvailable = function(len) {
  if (this.readCursor + len > this.inBuf.length) {
    throw("new InputBufferUnderrunError();");
  }
};

JSCustomReader.prototype.consume = function(bytesConsumed) {
  this.readCursor += bytesConsumed;
};


JSCustomReader.prototype.readByte = function() {
  this.ensureAvailable(1);
  return binary.readByte(this.inBuf[this.readCursor++]);
};

JSCustomReader.prototype.readI16 = function() {
  this.ensureAvailable(2);
  var i16 = binary.readI16(this.inBuf, this.readCursor);
  this.readCursor += 2;
  return i16;
};

JSCustomReader.prototype.readI32 = function() {
  this.ensureAvailable(4);
  var i32 = binary.readI32(this.inBuf, this.readCursor);
  this.readCursor += 4;
  return i32;
};

JSCustomReader.prototype.readDouble = function() {
  this.ensureAvailable(8);
  var d = binary.readDouble(this.inBuf, this.readCursor);
  this.readCursor += 8;
  return d;
};

JSCustomReader.prototype.readString = function(len) {
  this.ensureAvailable(len);
  var str = this.inBuf.toString('utf8', this.readCursor, this.readCursor + len);
  this.readCursor += len;
  return str;
};
