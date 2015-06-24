var HandlerContext = require('./handler_context' );

function Pipeline() {
  this._handlers = [];
}

Pipeline.prototype.addLast = function(name, handler) {
  this._handlers.push({ name: name, handler: handler})
}

Pipeline.prototype.fireChannelRead = function(message) {
  var curContext = new HandlerContext( this._handlers, 0 );
  curContext.invokeChannelRead( message );
}

Pipeline.prototype.write = function(message) {
  var curContext = new HandlerContext( this._handlers, this._handlers.length - 1 );
  curContext.invokeWrite( message );
}

module.exports = Pipeline;
