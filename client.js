var net = require('net');
var Channel = require('./channel');

function Client(options) {
  this._socket = new net.Socket( options );
  this._channel = new Channel( this._socket );

  this._socket.on( 'connect', this._connected.bind(this) );
}

Client.prototype._connected = function() {
  this.initialize( this._channel );
  this._channel.fireChannelActive();
}

Client.prototype.initialize = function(channel) {
}

Client.prototype.connect = function(port, host) {
  this._socket.connect(port, host);
}

Client.prototype.end = function() {
  this._socket.end();
}

module.exports = Client;