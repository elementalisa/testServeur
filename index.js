
var express =require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server);
var exec = require('exec');


app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function(){
  console.log(" listening on *:8080")
});

io.on('connection', function(client) {  
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
		
		exec(['uname', '-a'], function(err, out, code) {
			if (err instanceof Error)
				throw err;
			client.emit("serverInfo", out);
		});
		exec(['./cpu.bash'], function(err, out, code) {
			if (err instanceof Error){
				console.log(err);
				throw err;			
			}
			client.emit("cpuInfo", out);
		});

		var infoSystem = new InfoSystem(client);
		infoSystem.sendServerInfo();

	});
});
function InfoSystem(socketClient){
	this.socketClient= socketClient;
};
InfoSystem.prototype.sendServerInfo = function(){
	var client= this.socketClient;
	exec(['top', '-b', '-d1', '-n1'], function(err, out, code) {
		if (err instanceof Error)
			throw err;
		
		var result = out.replace(new RegExp("\n", 'g'), "<br/>\n");
		var resultServerInfo= result.substr(0, result.indexOf( "<br/>\n<br/>\n"));
		client.emit("infoRam", resultServerInfo);
	});
}