import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

@Injectable()
export class RoomService {
  http: Http;
  constructor(http: Http) {
    this.http = http;
  }

  createRoom(){
    return this.http.post('api/rooms', '').map((res: Response) => res.json());
  }

  getRoom(key, user_id){
    return this.http.get('api/rooms?key='+key+'&user_id='+user_id).map((res: Response) => res.json());
  }
}