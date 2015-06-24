
function HandlerContext(pipeline, index) {
  this.pipeline = pipeline;
  this._index = index;
}

HandlerContext.prototype.invokeChannelActive = function(message) {
  var currentHandler = this.pipeline.handlers[ this._index ];
  if ( currentHandler ) {
    if ( currentHandler.handler.channelRead ) {
      currentHandler.handler.channelActive( this, message );
    } else {
      this.fireChannelActive(message);
    }
  }
}

HandlerContext.prototype.fireChannelActive = function(message) {
  var nextContext = new HandlerContext( this.pipeline, this._index + 1 );
  nextContext.fireChannelActive();
}

HandlerContext.prototype.invokeChannelRead = function(message) {
  var currentHandler = this.pipeline.handlers[ this._index ];
  if ( currentHandler ) {
    if ( currentHandler.handler.channelRead ) {
      currentHandler.handler.channelRead( this, message );
    } else {
      this.fireChannelRead(message);
    }
  }
}

HandlerContext.prototype.fireChannelRead = function(message) {
  var nextContext = new HandlerContext( this.pipeline, this._index + 1 );
  nextContext.invokeChannelRead(message);
}

HandlerContext.prototype.invokeWrite = function(message) {
  if ( this._index < 0 ) {
    this.pipeline._writeToChannel( message );
  }
  var currentHandler = this.pipeline.handlers[ this._index ];
  if ( currentHandler ) {
    if ( currentHandler.handler.write ) {
      currentHandler.handler.write( this, message );
    } else {
      this.write( message );
    }
  }
}

HandlerContext.prototype.write = function(message) {
  var nextContext = new HandlerContext( this.pipeline, this._index - 1 );
  nextContext.invokeWrite( message );
}

Object.defineProperty( HandlerContext.prototype, 'name', {
  get: function() {
    return this.pipeline.handlers[ this._index ].name;
  }
})

module.exports = HandlerContext;