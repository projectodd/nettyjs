var Channel = require('../channel' );
var assert = require('assert');
var should = require('should');

describe( Channel, function() {

  it ( 'percolate reads through the pipeline', function(done) {
    var c = new Channel();

    c.pipeline.addLast( 'a', {
      channelRead: function(ctx, message) {
        ctx.fireChannelRead( message + ":A" );
      }

    })
    c.pipeline.addLast( 'b', {
      channelRead: function(ctx, message) {
        ctx.fireChannelRead( message + ":B");
      }
    });
    c.pipeline.addLast( 'c', {
      channelRead: function(ctx, message) {
        message.should.equal( "howdy:A:B" );
        done();
      }
    });

    c.fireChannelRead( "howdy" );
  } );

  it ( 'percolate reads through the pipeline with empty handlers', function(done) {
    var c = new Channel();

    c.pipeline.addLast( 'a', {
    })
    c.pipeline.addLast( 'b', {
    });
    c.pipeline.addLast( 'c', {
      channelRead: function(ctx, message) {
        message.should.equal( "howdy" );
        done();
      }
    });

    c.fireChannelRead( "howdy" );
  } );

  it ('should percolate writes through the pipeline', function(done) {

    var c = new Channel();

    c.pipeline.addLast( 'a', {
      write: function(ctx, message) {
        message.should.equal( "howdy:C:B");
        done();
      }
    });

    c.pipeline.addLast( 'b', {
      write: function(ctx, message) {
        ctx.write( message + ":B" );
      }
    });

    c.pipeline.addLast( 'c', {
      write: function(ctx, message) {
        ctx.write( message + ":C" );
      }
    });

    c.write( "howdy" );
  });

  it ('should percolate writes through the pipeline with empty handlers', function(done) {

    var c = new Channel();

    c.pipeline.addLast( 'a', {
      write: function(ctx, message) {
        message.should.equal( "howdy:D");
        done();
      }
    });

    c.pipeline.addLast( 'b', {
    });

    c.pipeline.addLast( 'c', {
    });


    c.pipeline.addLast( 'd', {
      write: function(ctx, message) {
        ctx.write( message + ":D" );
      }
    });

    c.write( "howdy" );
  });

} )
