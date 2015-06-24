
function HandlerContext(handlers, index) {
  this._handlers = handlers;
  this._index = index;
}

HandlerContext.prototype.invokeChannelRead = function(message) {
  var currentHandler = this._handlers[ this._index ];
  if ( currentHandler ) {
    if ( currentHandler.handler.channelRead ) {
      currentHandler.handler.channelRead( this, message );
    } else {
      this.fireChannelRead(message);
    }
  }
}

HandlerContext.prototype.fireChannelRead = function(message) {
  var nextContext = new HandlerContext( this._handlers, this._index + 1 );
  nextContext.invokeChannelRead(message);
}

HandlerContext.prototype.invokeWrite = function(message) {
  var currentHandler = this._handlers[ this._index ];
  if ( currentHandler ) {
    if ( currentHandler.handler.write ) {
      currentHandler.handler.write( this, message );
    } else {
      this.write( message );
    }
  }
}

HandlerContext.prototype.write = function(message) {
  var nextContext = new HandlerContext( this._handlers, this._index - 1 );
  nextContext.invokeWrite( message );
}

module.exports = HandlerContext;