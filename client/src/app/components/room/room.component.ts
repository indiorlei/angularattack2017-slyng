import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import {AuthService} from "../../services/auth.service";
import {PlayerService} from "../../services/player.service";
import {RoomService} from "../../services/room.service";

import { Player } from '../../classes/player';
import { Room } from '../../classes/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  providers: [PlayerService, RoomService]
})
export class RoomComponent implements OnInit {

  public roomID: string; 

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public authService: AuthService,
    public playerService: PlayerService,
    public roomService: RoomService,
    public firebase: AngularFire,
    private router: Router
  ) {

    this.roomID = this.route.snapshot.params['id'];

    this.roomService.join(this.authService.player, this.roomID);

  }

  ngOnInit() {

    this.roomService.gameStartedEmitter.subscribe(
      (gameStarted) => {
        if(gameStarted) {
          this.router.navigate(['/game', this.roomService.room.id]);
        }
      }
    );

  }

  startGame() {
    this.roomService.startGame();
  }

}