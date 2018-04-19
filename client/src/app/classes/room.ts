import { UUID } from 'angular2-uuid';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

export class Room {

	public redTeam : FirebaseListObservable<any>;
	public blueTeam : FirebaseListObservable<any>;

	public name : string;
	public gameStarted : boolean = false;
	public currentPlayerTurn : string = null;
	public currentPlayerName : string = null;

	public rockOwner : string = null;
	public rockX : number = 0;
  public rockY : number = 0;
  public rockXVelocity : number = 0;
  public rockYVelocity : number = 0;

  public gravityX : number = 0;
  public gravityY : number = 1200;

	constructor(
		public id : UUID
	) {
		
	}
	
}
