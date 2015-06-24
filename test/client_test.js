
var Client = require( '../client');
var net = require('net');

describe( 'Client & Server', function() {

  it( 'should setup the pipeline for a client', function(done) {
    var c = new Client();
    c.initialize = function(channel) {
      channel.write( "GET / HTTP/1.1\r\n\r\n");
      c.end();
      done();
    }
    c.connect( 80, 'www.google.com' );
  })
})