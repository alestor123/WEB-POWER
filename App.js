#!/usr/bin/env node
require('dotenv').config()
var express = require('express'),
app = express(),
pck = require('./package.json'),  
port = process.env.PORT || argv || 3000;
if(argv== '-v' ||argv == '--version'){
    console.log( `${pck.version}`)
  process.exit(1);
}
else if (argv =='-h'|| argv == '--help') { // checking undifined args
    console.log(`
    Usage: badge-generator <Port> 
`);
}
else{
    app.listen(port, () => console.log(`server running at ${port}`))
}