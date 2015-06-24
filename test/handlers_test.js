var Channel = require('../channel' );
var SimpleInboundHandler = require('../handlers' ).SimpleInboundHandler;

var assert = require('assert');
var should = require('should');

function Cheese(type) {
  this.type = type;
}

describe( "SimpleInboundHandler", function() {

  it( 'should apply appropriate predicates', function() {

    var bufferHandler = new SimpleInboundHandler(Buffer);
    bufferHandler.messageReceived = function(ctx, message) {
      ctx.fireChannelRead( 'buffer(' + message.toString() + ')' );
    }

    var cheeseHandler = new SimpleInboundHandler(Cheese);
    cheeseHandler.messageReceived = function(ctx, message) {
      message.processedByGeneric = true;
      ctx.fireChannelRead( message );
    }

    var cheddarHandler = new SimpleInboundHandler(Cheese);
    cheddarHandler.messageReceived = function(ctx, message) {
      if ( message.type == 'cheddar' ) {
        message.processedByCheddar = true;
      }
      ctx.fireChannelRead( message );
    }

    var messages = [];

    var c = new Channel();

    c.pipeline.addLast( 'buffer', bufferHandler );
    c.pipeline.addLast( 'cheese', cheeseHandler );
    c.pipeline.addLast( 'cheddar', cheddarHandler );
    c.pipeline.addLast( 'tail', {
      channelRead: function(ctx, message) {
        messages.push( message );
      }
    })

    c.fireChannelRead( new Buffer('Howdy' ) );
    c.fireChannelRead( new Cheese("gouda" ) );
    c.fireChannelRead( new Cheese("cheddar" ) );

    messages[0].should.equal( "buffer(Howdy)" );
    messages[1].should.be.instanceof( Cheese );
    messages[1].type.should.equal( 'gouda' );
    assert( messages[1].processedByGeneric );
    assert( ! messages[1].processedByCheddar );

    messages[2].should.be.instanceof( Cheese );
    messages[2].type.should.equal( 'cheddar' );
    assert( messages[2].processedByGeneric );
    assert( messages[2].processedByCheddar );
  })
})