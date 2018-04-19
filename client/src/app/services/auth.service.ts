import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';
import * as firebase from 'firebase';

import { Player } from '../classes/player';

@Injectable()
export class AuthService {

  public user : any = null;
  public player : Player = null;
  
  constructor(
    public af: AngularFire
  ) {
    this.af.auth.subscribe(user => {
      if(user) {

        //Player logged in
        this.user = user;

        //Update user data
        const playerData = af.database.object('/players/' + user.uid);
        playerData.update({
          displayName: user.auth.displayName,
          email: user.auth.email,
          photoURL: user.auth.photoURL
        });
    
        this.player = new Player(
          user.uid
        );
        playerData.subscribe(data => {
          this.player.displayName = data.displayName;
          this.player.email = data.email;
          this.player.photoURL = data.photoURL;
        });

        //Push to online players
        const onlinePlayers = af.database.object('/lobby/online_players/' + user.uid);
        onlinePlayers.set({
          displayName: user.auth.displayName,
          email: user.auth.email,
          photoURL: user.auth.photoURL
        });

        //Pop from online players
        const ref = firebase.database().ref().child('/lobby/online_players/' + user.uid);
        ref.onDisconnect().remove();

      } else {

        //Player not logged in
        this.user = null;
        
      }
    });
  }

  loginWithFacebook() {
	  return this.af.auth.login({
	    provider: AuthProviders.Facebook
	  });
	}
	 
	logout() {
    //Pop from online players
    const onlinePlayers = this.af.database.object('/lobby/online_players/' + this.user.uid);
    onlinePlayers.remove();
	  return this.af.auth.logout();
	}

}
