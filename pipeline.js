var HandlerContext = require('./handler_context' );

function Pipeline(channel) {
  this._channel = channel;
  this.handlers = [];
}

Pipeline.prototype.addLast = function(name, handler) {
  this.handlers.push({ name: name, handler: handler});
}

Pipeline.prototype.addFirst = function(name, handler) {
  this.handlers.shift({ name: name, handler: handler});
}

Pipeline.prototype.firChannelActive = function() {
  var curContext = new HandlerContext( this, 0 );
  curContext.invokeChannelActive( message );
}

Pipeline.prototype.fireChannelRead = function(message) {
  var curContext = new HandlerContext( this, 0 );
  curContext.invokeChannelRead( message );
}

Pipeline.prototype.write = function(message) {
  var curContext = new HandlerContext( this, this.handlers.length - 1 );
  curContext.invokeWrite( message );
}

Pipeline.prototype._writeToChannel = function(message) {
  //console.log( "write to channel: " + this._channel );
  this._channel._writeOutbound( message );
}

module.exports = Pipeline;
