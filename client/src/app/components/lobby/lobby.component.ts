import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PlayerService} from "../../services/player.service";
import {LobbyService} from "../../services/lobby.service";
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Player } from '../../classes/player';
import {Router} from "@angular/router";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  providers: [PlayerService, LobbyService]
})
export class LobbyComponent implements OnInit {

	public player: Player;
  public onlinePlayers: FirebaseListObservable<any[]>;
	public gameRooms: FirebaseListObservable<any[]>;

  constructor(
    public authService: AuthService,
    public playerService: PlayerService,
  	public lobbyService: LobbyService,
  	public firebase: AngularFire,
    private router: Router
  ) {

    this.onlinePlayers = this.lobbyService.getOnlinePlayers();

    this.gameRooms = this.lobbyService.getGameRooms();

  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
