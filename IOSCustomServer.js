exports.IOSCustomServer = IOSCustomServer;

var IOSCustomTransport = require("./IOSCustomTransport").IOSCustomTransport;

function IOSCustomServer(processor, handler, sendCB, options = {}) {
  if (processor.Processor) {
    processor = processor.Processor;
  }
  this.processor = new processor(handler);
  this.handler = handler;
  this.sendCB = sendCB;
  this.transport = options.transport || IOSCustomTransport;
  this.protocol = options.protocol || thrift.TJSONProtocol;
};

IOSCustomServer.prototype.receiveMessage = function(buf) {
  this.processor.process(new this.protocol(new this.transport(buf)), new this.protocol(new this.transport(null, this.sendCB)));
}
