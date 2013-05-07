var express = require('express')
  , https = require('https')
  , path = require('path')
  , io = require('socket.io')
  , fs = require('fs')
  , mongoose = require('mongoose');

var options = {
    key: fs.readFileSync('/etc/httpd/conf.d/private.key'), // 秘密鍵
    cert: fs.readFileSync('/etc/httpd/conf.d/public.crt'), // 公開鍵
};
 
var app = express()
  , server = require('https').createServer(options,app)
  , io = io.listen(server);
 
app.configure(function(){
  app.set('port', process.env.PORT || 8887);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});
 
server.listen(app.get('port'))
var place = '';
var db = mongoose.connect('mongodb://localhost/map5');
var Schema = new mongoose.Schema({
     place:{type:String},
     lati:{type:Number},
     longi:{type:Number},
     msg:{type:String},
     date:{type:Number}
});
var Chat = db.model('thread',Schema);
map = io.sockets.on('connection', function(client) {
  client.emit('connected');

  client.on('init', function() {
    var show = '{"thread":[';
    Chat.find(function(err,thread){
      if(err){console.log(err);}
      for (var i=0, size=thread.length; i<size; ++i) {
        if(i!=0){show += ',';}
        show += '["'+thread[i].lati+'","'+thread[i].longi+'","'+thread[i].msg+'","'+thread[i].place+'"]';
      }
      show += ']}';
//       console.log(show);
      client.emit('show',show);
    });

  });

  client.on('add', function(area) {
    place = this.id;
    var u_map = {
      "lati":area[0],
      "longi":area[1],
      "msg":area[2],
      "place":place,
      "date":new Date().getDate()
    };
    var add_marker = new Chat(u_map);
    add_marker.save(function(err){
      if(err){ return; }
    })
    map.emit('add',u_map);    
  });

  client.on('chat', function(data) {
//     console.log('chat ' + data);
    map.emit('chat',data);
  });
  
  client.on('disconnect', function() {
    Chat.remove({place:this.id}, function(err) {
      
    });
//     console.log('place '+this.id);
    map.emit('del',this.id);
  });
  
});

