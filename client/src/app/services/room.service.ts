import { Injectable, EventEmitter } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

import { Player } from '../classes/player';
import { Room } from '../classes/room';

@Injectable()
export class RoomService {

  gameStartedEmitter:EventEmitter<any> = new EventEmitter();

  public room : Room = null;
  public myTeam : string = null;

  //Auxiliar para remover no disconnect
  public playerRef : any = null;
  
  constructor(
    public af: AngularFire
  ) {

  }

  join(player: Player, roomID: string): Promise<Room> {
    
    const roomData = this.af.database.object('/lobby/rooms/' + roomID);
    
    this.room = new Room(
      roomID
    );

    this.room.blueTeam = this.af.database.list('/lobby/rooms/' + roomID + '/teams/blue');
    this.room.redTeam = this.af.database.list('/lobby/rooms/' + roomID + '/teams/red');

    return new Promise(resolve => {

      //Join at a Team
      var blueTeamCount = 0;
      var redTeamCount = 0;
      firebase.database().ref('/lobby/rooms/' + roomID + '/teams/blue/').once("value").then(snapshot => {
          blueTeamCount = snapshot.numChildren();
          this.myTeam = snapshot.hasChild(player.id) ? 'blue' : null;
          firebase.database().ref('/lobby/rooms/' + roomID + '/teams/red/').once("value").then(snapshot => {
            redTeamCount = snapshot.numChildren();
            if(!this.myTeam) {
              this.myTeam = snapshot.hasChild(player.id) ? 'red' : null;
            }

            if(!this.myTeam) {
              this.myTeam = (blueTeamCount <= redTeamCount) ? 'blue' : 'red';
            }

            if(this.myTeam) {
              const playerList = this.af.database.object('/lobby/rooms/' + roomID + '/teams/' + this.myTeam + '/' + player.id);
              playerList.set(player);
              this.playerRef = firebase.database().ref().child('/lobby/rooms/' + roomID + '/teams/' + this.myTeam + '/' + player.id);
              this.playerRef.onDisconnect().remove();
            }

            resolve(this.room);
        });
      });   

      //Subscribe to RoomData
      roomData.subscribe(data => {
        this.room.name = data.name;
        this.room.gameStarted = data.gameStarted;
        this.room.currentPlayerName = data.currentPlayerName;
        if(this.room.gameStarted && this.playerRef) {
          this.playerRef.onDisconnect().cancel();
          this.gameStartedEmitter.emit(true);
        }
      });
    });

  }

  startGame() {
    this.update({gameStarted: true});
  }

  update(data) {
    const roomData = this.af.database.object('/lobby/rooms/' + this.room.id);
    roomData.update(data);
  }

}
