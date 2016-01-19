var io = require('socket.io')();

io.on('connection', function (socket) {

	socket.on('listen-room', function(data) {
		socket.join('room'+data.key);
	});

});

module.exports = io;