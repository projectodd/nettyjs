var Q = require('q');
var Pipeline = require('./pipeline');

function Channel(sink) {
  this._sink = sink;
  this.pipeline = new Pipeline(this);
}

Channel.prototype.fireChannelActive = function() {
  this.pipeline.fireChannelActive();
}

Channel.prototype.fireChannelRead = function(message) {
  this.pipeline.fireChannelRead(message);
}

Channel.prototype.write = function(message) {
  this.pipeline.write(message);
}

Channel.prototype.close = function() {
  if ( this._sink && this._sink.end ) {
    var deferred = Q.defer();
    this._sink.end( function() {
      deferred.resolve();
    });
    return deferred.promise;
  }

  return Q.resolve();
}

Channel.prototype._writeOutbound = function(message) {
  if ( this._sink ) {
    this._sink.write( message );
  }
}

module.exports = Channel;
