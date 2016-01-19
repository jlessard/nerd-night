var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var mongo = require('./api/mongo');
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTING / CONTROLLERS

var rooms = require('./api/rooms'),
		catchAll = require("./api/catch-all");

app.use('/api/rooms', rooms);
app.use('', catchAll);

// ~~~~
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});

var io = require('./api/socket');
io.attach(server);