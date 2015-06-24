

function SimpleInboundHandler(predicate) {
  this._predicate = function(message) {
    return message instanceof predicate;
  };
}

SimpleInboundHandler.prototype.channelRead = function(ctx, message) {
  if ( this._predicate( message ) ) {
    this.messageReceived( ctx, message );
  } else {
    ctx.fireChannelRead( message );
  }
}

SimpleInboundHandler.prototype.messageReceived = function(ctx, message) {
  ctx.fireChannelRead( message );
}

module.exports.SimpleInboundHandler = SimpleInboundHandler;