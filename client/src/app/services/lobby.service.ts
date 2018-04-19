import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Player } from '../classes/player';

@Injectable()
export class LobbyService {

  public onlinePlayers : Player[] = null;
  
  constructor(
    public af: AngularFire
  ) {

  }

  getOnlinePlayers(): FirebaseListObservable<any> {
    
    return this.af.database.list('/lobby/online_players');

  }

  getGameRooms(): FirebaseListObservable<any> {
    
    return this.af.database.list('/lobby/rooms', {
      query: {
        orderByChild: 'gameStarted'
      }
    });

  }

}
