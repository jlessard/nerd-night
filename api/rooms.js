var express = require('express'),
		utils = require('./utils'),
		mongo = require('./mongo'),
		io = require('./socket'),
		_ = require('lodash');

/*

~~~~ /api/rooms ~~~~

room: {
	key: 'A9' // INDEX
	users: []
	created_at
}

*/

var router = express.Router();

router.get('', getRoom);
router.post('/user', joinRoom);
router.post('', createRoom);
router.put('/user', updateUser);
router.put('', updateRoom);
router.delete('', deleteRoom);

function getRoom(req, res, next) {
	var key = req.query.key;

	mongo().find('rooms', { key: req.query.key })
	.then(function(result){
		var room = result[0];
		// if user is not already in room, join room and announce join
		console.log('room.users',room.users);
		return res.json(room);
	});
}

function createRoom(req, res, next) {
	var key = utils.randString(2),
			room = {
				key: key,
				users: [],
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

	mongo().update('rooms', { key: room.key }, room)
	.then(function(update){
		console.log('room updated');
		io.to('room'+room.key).emit('room', { room: room });
	});
}

function deleteRoom(req, res, next) {

}

// add user to users array and notify room
function joinRoom(req, res, next) {
	var user = req.body.user,
			room = req.body.room,
			dbRoom;

	mongo().find('rooms', {  key: room.key })
	.then(function(result){
		dbRoom = result[0];
		dbRoom.users.push(user);
		return mongo().update('rooms', { key: room.key }, { users: dbRoom.users });
	})
	.then(function(update){
		io.to('room'+room.key).emit('room', { msg: 'A new user has joined this room!', room: dbRoom });
	})
	.fail(function(err){
		console.log('join room error', err);
	});
}

function updateUser(req, res, next) {
	var user = req.body.user,
			room = req.body.room,
			dbRoom, dbUser;

	console.log('update user', user, room);

	mongo().find('rooms', { key: room.key })
	.then(function(result){
		dbRoom = result[0];
		console.log('before update', dbRoom.users);
		dbUserIndex = _.findIndex(dbRoom.users, { id: user.id });
		console.log('index', dbUserIndex);
		dbRoom.users[dbUserIndex] = user;
		console.log('after update', dbRoom.users);
		return mongo().update('rooms', { key: room.key }, { users: dbRoom.users });
	})
	.then(function(update){
		io.to('room'+room.key).emit('room', { room: dbRoom });
	})
	.fail(function(err){
		console.log('join room error', err);
	});
}

module.exports = router;