exports.payload_gen = function payload_gen(payload_rest){
  var len = payload_rest.length
  var payload = new Buffer(len+5)

  if(len > 999){
    payload.writeUInt8("0x0"+len.toString()[0],0)
    payload.writeUInt8("0x0"+len.toString()[1],1)
    payload.writeUInt8("0x0"+len.toString()[2],2)
    payload.writeUInt8("0x0"+len.toString()[3],3)
  } else if(len > 99){
    payload.writeUInt8("0x00",0)
    payload.writeUInt8("0x0"+len.toString()[0],1)
    payload.writeUInt8("0x0"+len.toString()[1],2)
    payload.writeUInt8("0x0"+len.toString()[2],3)
  } else if(len > 9){
    payload.writeUInt8("0x00",0)
    payload.writeUInt8("0x00",1)
    payload.writeUInt8("0x0"+len.toString()[0],2)
    payload.writeUInt8("0x0"+len.toString()[1],3)
  } else {
    payload.writeUInt8("0x00",0)
    payload.writeUInt8("0x00",1)
    payload.writeUInt8("0x00",2)
    payload.writeUInt8("0x0"+len.toString()[0],3)
  }
  payload.writeUInt8(0xff,4)

  for (var i = 0;i<payload_rest.length;i++){
    payload.writeUInt8(payload_rest.charCodeAt(i),5+i);
  }
  return payload
}

exports.makeid = function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 30; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = exports
