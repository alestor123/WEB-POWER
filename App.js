#!/usr/bin/env node
// this is a simple code for a remote power option powered by express 
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

else if (argv =='-i'|| argv == '--issue') { // checking undifined args
  console.log(`
  Issues at ${pck.bugs.url} 
`);
}

else if (argv =='-a'|| argv == '--author') { // checking undifined args
  console.log(`
  Author: ${pck.author} 
`);
}

else if (argv =='-d'|| argv == '--docs') { // checking undifined args
  console.log(`
  Docs at ${pck.homepage} 
`);}
else{
    app.listen(port, () => console.log(`server running at ${port}`))
}
// credits : inspired by  hemant both sleep-mode and power-off Licence MIT
function poweroff(cb) {
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
function sleep(cb){
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
    console.log(req.ip + 'requested address')
  })
app.delete('/', (req, res) => {
    res.end()
    console.log(`Stopped ${pck.name}`)
    console.log(req.ip + 'Stopped server')
    process.exit()
})
app.post('/off',(req, res) => {
    poweroff((err, stderr, stdout) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: 'Can\'t run power-off' })
      } else {
        res.end()
      }
    })
  })
  
  app.post('/sleep',  (req, res)  =>{
    sleep( (err, stderr, stdout) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: 'Can\'t run sleep' })
      } else {
          console.log(req.ip + 'Send a sleep command')
        res.end()
      }
    })
  })
  