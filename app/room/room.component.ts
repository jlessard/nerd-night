import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {RoomService} from './room.service';

declare var io: any;

@Component({
    selector: 'room',
    templateUrl: 'app/room/room.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [RoomService]
}) 

export class RoomComponent {
  room: Object = {};
  user_id = '';
  socket: any;
  constructor(roomService: RoomService, routeParams: RouteParams) {
    this.socket = io('http://localhost:3000');
    this.socket.emit('listen-room', { key: routeParams.get('key') });
    this.socket.on('room', function(data) { console.log('contact with room yay'); });

    // * USER AUTH - moving this this to ./user.ts *

    this.user_id = localStorage.getItem('user_id');
    console.log('got id', this.user_id);

    if (!this.user_id) {
      this.user_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('user_id', this.user_id);
      console.log('set id', this.user_id);
    };

    // * / *

    roomService.getRoom(routeParams.get('key'), this.user_id).subscribe(res => this.onGetRoom(res));
  }
  onGetRoom(room){
    this.room = room;
  }
}