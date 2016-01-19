import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HomeComponent} from './home/home.component';
import {RoomComponent} from './room/room.component';

@Component({
  selector: 'nerd-night',
  templateUrl: 'app/app.html',
  styleUrls: ['css/app.min.css'],
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  { path: '', name: 'Home', component: HomeComponent },
  { path: 'r/:key', name: 'Room', component: RoomComponent }
])

export class AppComponent {

}