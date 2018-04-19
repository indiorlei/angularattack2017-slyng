import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Player } from '../classes/player';

@Injectable()
export class PlayerService {

  public player : Player = null;
  
  constructor(
    public af: AngularFire
  ) {

  }

  getPlayer(id: string): Promise<Player> {
    
    const playerData = this.af.database.object('/players/' + id);
    
    this.player = new Player(
      id
    );

    return new Promise(resolve => {
      playerData.subscribe(data => {
        this.player.displayName = data.displayName;
        this.player.email = data.email;
        this.player.photoURL = data.photoURL;
        resolve(this.player);
      });
    });

  }

}
