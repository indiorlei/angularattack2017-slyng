export class Player {

	public displayName : string;
  public email : string;
  public photoURL : string;

  //inGame
  public life : number = 100;
  public x : number = Math.random() * (1800 - -100) - 100;
  public y : number = 850;
  public facing : string = 'idle'; //left | right | idle
  public lastShot : number = 0;

	constructor(
		public id : string
	) {
		
	}
}
