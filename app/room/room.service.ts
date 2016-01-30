import {Injectable} from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';

@Injectable()
export class RoomService {
  http: Http;
  constructor(http: Http) {
    this.http = http;
  }

  createRoom(){
    return this.http.post('api/rooms', '').map((res: Response) => res.json());
  }

  getRoom(key){
    return this.http.get('api/rooms?key='+key).map((res: Response) => res.json());
  }

  joinRoom(room, user){
    return this.http.post(
              'api/rooms/user', 
              JSON.stringify({ room: room, user: user }),
              { headers: new Headers({ 'Content-Type': 'application/json' }) }
            )
            .map((res: Response) => res.json());
  }

  updateUser(room, user) {
    console.log('making put request');
    return this.http.put(
              'api/rooms/user',
              JSON.stringify({ room: room, user: user }),
              { headers: new Headers({ 'Content-Type': 'application/json' }) }
            )
            .map((res: Response) => res.json());
  }
}