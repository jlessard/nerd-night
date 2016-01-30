import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {RoomService} from './room.service';
import {NgZone} from 'angular2/core';
import {User} from '../user';

declare var io: any;
declare var _: any;

@Component({
    selector: 'room',
    templateUrl: 'app/room/room.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [RoomService, User]
}) 

export class RoomComponent {
  room: Object = { key: '', users: [] };
  user: any;
  socket: any;
  zone: NgZone = new NgZone({ enableLongStackTrace: false });
  constructor(private _roomService: RoomService, routeParams: RouteParams, private _user: User) {
    // INIT SOCKETS
    this.socket = io('http://localhost:3000');
    this.socket.emit('listen-room', { key: routeParams.get('key') });
    this.socket.on('room', (data) => this.onSocketMsg(data));

    // INIT USER
    this.user = this._user.getUser();
    console.log('user', this.user);

    // INIT ROOM
    this._roomService.getRoom(routeParams.get('key'))
		.subscribe(res => this.onGetRoom(res));
  }
  onGetRoom(room){
    this.room = room;
		console.log('got room', room);
		if (!_.find(room.users, { id: this.user.id })) {
			console.log('joining room');
			this._roomService.joinRoom(room, this.user).subscribe();
		}
  }
  onSocketMsg(data) {
		console.log('room socket', data);
		// update room
		if (data.room) {
			this.zone.run(() => { this.room = data.room; });

			var me = _.find(data.room.users, { id: this.user.id });
			console.log('me', me);
			if (!me) return;
		}
  }
  onNameChange(e) {
		console.log('name changed', this.user.name);
		this._user.updateUser('name', this.user.name);
		this._roomService.updateUser(this.room, this.user).subscribe();
  }
}