var Pipeline = require('./pipeline');

function Channel() {
  this.pipeline = new Pipeline();
}

Channel.prototype.fireChannelRead = function(message) {
  this.pipeline.fireChannelRead(message);
}

Channel.prototype.write = function(message) {
  this.pipeline.write(message);
}

module.exports = Channel;
