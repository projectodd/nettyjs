var net = require('net');
var Channel = require('./channel');
var Q = require('q');

function Bootstrap(options) {
  this._options = options;
}

Bootstrap.prototype.handler = undefined;

Bootstrap.prototype.connect = function(port, host) {
  var socket = new net.Socket( this._options );
  var deferred = Q.defer();

  var self = this;

  socket.on( 'connect', function() {
    var channel = new Channel( socket );
    if ( self.handler && self.handler.initChannel ) {
      self.handler.initChannel( channel );
      channel.fireChannelActive();
    }
    deferred.resolve( channel );
  });

  socket.on( 'error', function(err) {
    deferred.reject(err);
  })

  socket.connect( port, host );

  return deferred.promise;
}

module.exports = Bootstrap;