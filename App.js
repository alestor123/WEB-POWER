#!/usr/bin/env node
require('dotenv').config()
var express = require('express'),
app = express(),
isLinux = require('is-linux'),
ip = require("ip"),
isOsx = require('is-osx'),
isWindows = require('is-windows'),
argv = process.argv[2],
pck = require('./package.json'),  
cp = require('child_process'),
port = process.env.PORT || argv || 3000;
if(argv== '-v' ||argv == '--version'){
    console.log( `${pck.version}`)
  process.exit(1);
}
else if (argv =='-h'|| argv == '--help') { // checking undifined args
    console.log(`
    Usage: web-power <Port> 
`);
}
else{
    app.listen(port, () => console.log(`server running at ${port}`))
}

function poweroff() {
    var cmd = '';
	if(isLinux() || isOsx()) {
		cmd = 'sudo shutdown -h now';
	} else if(isWindows()) {
		cmd = 'shutdown -s -t 0';
	} else {
		throw new Error('Unknown OS!');
	}
	cp.exec(cmd,  (err, stdout, stderr) => {
		cb(err, stdout, stderr);
	});
}
function sleep(){
    var cmd = '';
	if (isOsx()) {
		cmd = 'pmset sleepnow';
	} else if (isLinux()) {
		// should work on all OSs using systemd.
		cmd = 'sudo systemctl suspend';
	} else if (isWindows()) {
		cmd = 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
	} else {
		throw new Error('Unknown OS!');
	}
	cp.exec(cmd, (err, stderr, stdout) => {
		cb(err, stderr, stdout);
	});
}
app.get('/address',(req, res) => {
    res.json({ address: ip.address() })
  })
app.delete('/', function (req, res) {
    res.end()
    console.log(`Stopped ${pck.name}`)
    process.exit()
})
  