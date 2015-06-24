
var Bootstrap = require( '../bootstrap');
var net = require('net');

describe( 'Client Bootstrap', function() {

  it( 'should setup the pipeline for a client', function(done) {
    var bootstrap = new Bootstrap();

    bootstrap.handler = function(channel) {
    }

    bootstrap.connect( 80, 'www.google.com' )
      .then( function(c) {
        return c.close();
      })
      .done( done );
  })
})