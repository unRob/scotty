var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../config.json')));

config = JSON.stringify(config.wifi);

var cmd = "tessel push -s tessel.js -a '"+config+"'";
console.log(cmd);
child_process.exec(cmd, function(err, stdout, stdin){
	console.log(err);
	console.log(stdout);
});