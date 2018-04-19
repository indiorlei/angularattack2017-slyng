import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import {AuthService} from "../../../services/auth.service";
import { Room } from '../../../classes/room';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-lobby-create-room',
  templateUrl: './lobby-create-room.component.html',
  styleUrls: ['./lobby-create-room.component.scss']
})
export class LobbyCreateRoomComponent implements OnInit {

	roomName = '';

  constructor(
    public authService: AuthService,
  	public firebase: AngularFire,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() { 

  	var room = new Room(
  		UUID.UUID()
  	);

    room.name = this.roomName;
    room.currentPlayerTurn = this.authService.player.id;

  	var createdRoom = this.firebase.database.object('/lobby/rooms/' + room.id);
		createdRoom.set(room);

    this.router.navigate(['/room', room.id]);

  }

}
