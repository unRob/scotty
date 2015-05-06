var tessel = require("tessel");
var wifi = require('wifi-cc3000');
var gpio = tessel.port.GPIO;
var http = require('http');

var led = tessel.led[1].output(0);
var ledOn = tessel.led[0].output(0);
var port = gpio.digital[1];
ledOn.output(0);
port.write(0);

var ledTO = null;
var pingTO = null;
var CONNECTED = false;

var connecting = function() {
	ledOn.toggle();
	ledTO = setTimeout(connecting, 1000);
};
connecting();

var ping = function(){
	console.log('pinging');
	try {
		http.get("http://puerta.pati.to/ping", function(res){
			console.log("pinged");
		}).on('error', function(e){
			console.log("Ping error: ", e.message);
		});
	} catch(err) {
		console.log('Ping failed');
	}

	setTimeout(ping, 60000);
};

var wifi_config = process.argv.pop();
var connect = function(){
	wifi.connect(wifi_config);
};
var powerCycle = function() {
	wifi.reset(function(){
		timeouts = 0;
		console.log('done power-cycling');
		setTimeout(function(){
			if (!wifi.isConnected()){
				connect();
			}
		}, 20000);
	});
};

var server = null;
wifi.on('connect', function(data){
	console.log("WIFI connected, addr: "+data.ip);
	clearTimeout(ledTO);
	ledOn.output(1);

	var push_the_red_button = function() {
		led.toggle();
		port.write(1);
		setTimeout(function(){
			port.write(0);
			led.toggle();
		}, 500);
	};

	var handle_request = function(req, res){
		push_the_red_button();
		console.log('incoming');
		res.writeHead(200, {'Content-type': 'text/plain'});
		res.end("Ok\n");
	};

	tessel.button.on('press', function(time){
		console.log('button');
		push_the_red_button();
	});

	server = http.createServer(handle_request);
	server.listen(80, function(){
		console.log("HTTP ready on port 80");
		CONNECTED = true;
		ping();
	});
});

wifi.on('disconnect', function(){
	CONNECTED = FALSE;
	console.log("WIFI disconnected");
	ledOn.output(0);
	setTimeout(connect, 30000);
});

wifi.on('timeout', function(err){
	console.log("WIFI timeout");
	timeouts++;
	if (timeouts > 2) {
		console.log('power-cycling');
		powerCycle();
	} else {
		connect();
	}
});