var tessel = require("tessel");
var gpio = tessel.port.GPIO;
var http = require('http');

// para ver cuando se pide el elevador
var led = tessel.led[1].output(0);
// para ver que tessel ya inició (buggy as hell)
var ledOn = tessel.led[0].output(0);
var port = gpio.digital[1];
port.write(0);

// Limitar acceso a red interna
var remoteAddr = function(req) {
	return req.connection.remoteAddress || req.connection.socket.remoteAddress;
};

// Llamar el elevador
var push_the_red_button = function(){
	led.toggle();
	port.write(1);
	setTimeout(function(){
		port.write(0);
		led.toggle();
	}, 500);
};

var handle_request = function(req, res) {
	push_the_red_button();
	console.log('incoming');
	res.writeHead(200, {'Content-type': 'text/plain'});
	res.end("Ok\n");
};

var server = http.createServer(handle_request);
server.listen(80, '127.0.0.1');

// Ya estamos arriba
console.log("Listening on "+80);
ledOn.output(1);
setTimeout(function(){ledOn.output(0);}, 5000);

// Debug
tessel.button.on('press', function(time){
	console.log(time);
	push_the_red_button();
});