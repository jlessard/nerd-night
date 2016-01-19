var express = require('express'),
		utils = require('./utils'),
		mongo = require('./mongo'),
		io = require('./socket');

/*

~~~~ /api/r ~~~~

room: {
	_id
	key: 'A9'
	users: []
	created_at
}

*/

var router = express.Router();

router.get('', getRoom);
router.post('', createRoom);
router.put('', updateRoom);
router.delete('', deleteRoom);

function getRoom(req, res, next) {
	var key = req.query.key,
			user_id = req.query.user_id;

	mongo().find('rooms', { key: req.query.key })
	.then(function(result){
		var room = result[0];
		// if user is not already in room, join room and announce join
		console.log('rom.users',room.users);
		if(!room.users) room.users = [];
		if(room.users.indexOf(user_id) == -1) joinRoom(room, user_id);
		return res.json(room);
	});
}

function createRoom(req, res, next) {
	var key = utils.randString(2),
			room = {
				key: key,
				created_at: new Date().toJSON()
			};

	mongo().insert('rooms', room)
	.then(function(result){
		console.log('inserted room', result);
		return res.json(result);
	});
}

function updateRoom(req, res, next) {
	var room = req.body.room;
	console.log('updating room', room);

	mongo().update('rooms', { _id: room._id }, room)
	.then(function(update){
		console.log('room updated');
	});
}

function deleteRoom(req, res, next) {

}

// ~~~~ HELPERS ~~~~

// add user to users array and notify room
function joinRoom(room, user_id) {
	room.users.push(user_id);
	mongo().update('rooms', { _id: room._id }, { users: room.users })
	.then(function(){
		console.log('join room', room.key, room);
		io.to('room'+room.key).emit('room', { msg: 'A new user has joined this room!', room: room });
	});
}

module.exports = router;