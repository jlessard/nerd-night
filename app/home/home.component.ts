import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {RoomService} from '../room/room.service';

@Component({
    selector: 'home',
    templateUrl: 'app/home/home.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [RoomService]
}) 

export class HomeComponent {
	room:Object
	constructor(private _roomService: RoomService, private _router: Router) { }
	createRoom(){
		this._roomService.createRoom().subscribe(data => this.navToRoom(data));
	}
	navToRoom(room) {
			console.log('welcome to ', room);
		this._router.navigate(['Room', { key: room.key }]);
	}
}