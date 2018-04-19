import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';

import {AuthService} from "../../services/auth.service";
import {PlayerService} from "../../services/player.service";
import {RoomService} from "../../services/room.service";

import { Player } from '../../classes/player';
import { Room } from '../../classes/room';

import * as Phaser from 'phaser-ce';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [PlayerService, RoomService]
})
export class GameComponent implements OnInit {

  public roomID: string; 
  public roomData: FirebaseObjectObservable<any>; 
  public currentPlayerTurn: string = null; 

  //Hud do capiroto!
  public currentPlayerName: string = null; 
  public currentWind: string = null; 
  public timeToShot: number = 0; 
  public timeToShotInterval; 
  public showSorry: boolean = false; 

  public game;
  public rock;
  public cursors;
  public fireButton;

  public players : any[] = [];
  public me : FirebaseObjectObservable<any>;
  public lastRockOwner : string = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public authService: AuthService,
    public playerService: PlayerService,
    public roomService: RoomService,
    public af: AngularFire,
  ) {

    this.roomID = this.route.snapshot.params['id'];

    var self = this;

    this.roomService.join(this.authService.player, this.roomID).then(room => {
      this.roomData = this.af.database.object('/lobby/rooms/' + this.roomID);
      this.roomData.subscribe(data => {
        self.currentPlayerTurn = data.currentPlayerTurn;
        self.currentPlayerName = data.currentPlayerName;
        self.currentWind = data.gravityX;
        if(data.rockOwner && self.lastRockOwner != data.rockOwner) {
          if(self.rock) {
            self.rock.reset(data.rockX, data.rockY);
            self.rock.body.velocity.x = data.rockXVelocity;
            self.rock.body.velocity.y = data.rockYVelocity;
          }
          self.lastRockOwner = data.rockOwner;
        }
        if(self.game.physics && self.game.physics.p2) {
          self.game.physics.p2.gravity.y = data.gravityY;
          self.game.physics.p2.gravity.x = data.gravityX;
        }
      });
      this.me = this.af.database.object('/lobby/rooms/' + this.roomID + '/teams/' + this.roomService.myTeam + '/' + this.authService.player.id);
    });


  }

  ngOnInit() {

    setTimeout(() => {
      this.showSorry = true;
    }, 30000);

    var self = this;

    self.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'slyng', { preload: preload_game, create: create_game, update: update_game, render: render_game});

    function preload_game() {

      self.game.load.image('background', 'assets/backgrounds/game.png');

      self.game.load.spritesheet('blue', 'assets/sprites/blue/sprite.png', 116, 130);
      self.game.load.spritesheet('red', 'assets/sprites/red/sprite.png', 116, 130);
      self.game.load.spritesheet('rock', 'assets/sprites/rock.png', 21, 19);

    }

    function create_game() {

      self.game.physics.startSystem(Phaser.Physics.P2JS);
      self.game.physics.p2.gravity.y = 1200;
      self.game.physics.p2.gravity.x = 0;

      self.game.add.tileSprite(0, 0, 1920, 1080, 'background');
      self.game.world.setBounds(0, 0, 1920, 915);

      self.rock = self.game.add.sprite(0, 0, 'rock');
      self.game.physics.p2.enable(self.rock);
      self.rock.body.collideWorldBounds = true;
      self.rock.body.friction = 10000;

      self.game.camera.follow(self.rock, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      var rockMaterial = self.game.physics.p2.createMaterial('rockMaterial', self.rock.body);
      var worldMaterial = self.game.physics.p2.createMaterial('worldMaterial');
      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      self.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
      //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
      //  those 2 materials collide it uses the following settings.
      //  A single material can be used by as many different sprites as you like.
      var contactMaterial = self.game.physics.p2.createContactMaterial(rockMaterial, worldMaterial);
      contactMaterial.friction = 10;     // Friction to use in the contact of these two materials.
      contactMaterial.restitution = 0.2;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

      self.cursors = self.game.input.keyboard.createCursorKeys();
      self.fireButton = self.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      self.roomService.room.blueTeam.subscribe(team => {
        team.forEach(teamPlayer => {
          self.renderPlayer('blue', teamPlayer);
        });
      });
      self.roomService.room.redTeam.subscribe(team => {
        team.forEach(teamPlayer => {
          self.renderPlayer('red', teamPlayer);
        });
      });

    }

    function update_game() {

      if(self.players[self.authService.player.id]) {
        self.players[self.authService.player.id].body.velocity.x = 0;
      }

      if(self.rock.body.velocity.x < 1 && self.rock.body.velocity.x > -1 && 
        self.rock.body.velocity.y < 1 && self.rock.body.velocity.y > -1) {
          self.rock.kill();
      } else {
        self.game.camera.follow(self.rock, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
      }

      if(self.me && self.currentPlayerTurn == self.authService.player.id) {

        if(self.rock.body.velocity.x < 1 && self.rock.body.velocity.x > -1 && 
          self.rock.body.velocity.y < 1 && self.rock.body.velocity.y > -1 &&
          self.authService && self.authService.player && self.roomService.room.currentPlayerName != self.authService.player.displayName) {
            self.roomService.update({
              currentPlayerName: self.authService.player.displayName,
              gravityX: Math.random() * (500 - -500) - 500
            });
            self.startTimer();
        }

        if (self.cursors.left.isDown && self.timeToShot > 0) {
          self.game.camera.follow(self.players[self.authService.player.id], Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
          self.players[self.authService.player.id].body.velocity.x = -160;
          self.players[self.authService.player.id].body.x = Math.max(0, self.players[self.authService.player.id].body.x);
          self.players[self.authService.player.id].body.x = Math.min(1920, self.players[self.authService.player.id].body.x);
          self.me.update({
            x: self.players[self.authService.player.id].body.x,
            facing: 'left'
          });
        } else if (self.cursors.right.isDown && self.timeToShot > 0) {
          self.game.camera.follow(self.players[self.authService.player.id], Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
          self.players[self.authService.player.id].body.velocity.x = +160;
          self.players[self.authService.player.id].body.x = Math.max(0, self.players[self.authService.player.id].body.x);
          self.players[self.authService.player.id].body.x = Math.min(1920, self.players[self.authService.player.id].body.x);
          self.me.update({
            x: self.players[self.authService.player.id].body.x,
            facing: 'right'
          });
        } else {
            self.me.update({
              facing: 'idle'
            });
        }

        if (self.fireButton.isDown && self.timeToShot > 0) {

          self.passTurn();

        }

      }

    }

    function render_game() {

    }

  }

  passTurn() {

    this.me.update({
      lastShot: Math.floor(Date.now() / 1000),
      facing: 'idle'
    });

    var nextTeam = 'blue';
    if(this.roomService.myTeam == 'blue') {
      nextTeam = 'red';
    }

    const nextPlayer = this.af.database.list('/lobby/rooms/' + this.roomID + '/teams/' + nextTeam, {
      query: {
        orderByChild: 'lastShot',
        limitToFirst: 1
      }
    });

    var nextPlayerSubscription = nextPlayer.subscribe(players => {
      nextPlayerSubscription.unsubscribe();
      this.roomService.update({
        currentPlayerTurn: players[0] ? players[0].id : this.authService.player.id,
        rockOwner: this.authService.player.id,
        rockX: this.players[this.authService.player.id].scale.x == 1 ? this.players[this.authService.player.id].x - 56 : this.players[this.authService.player.id].x + 56,
        rockY: this.players[this.authService.player.id].y,
        rockYVelocity: -500,
        rockXVelocity: 2000 * (this.players[this.authService.player.id].scale.x * (-1))
      });
    });

    this.timeToShot = 0;
    clearInterval(this.timeToShotInterval);

  }

  startTimer() {
    this.timeToShot = 15;
    this.timeToShotInterval = setInterval(() => {
      this.timeToShot -= 1;
      if(this.timeToShot == 0) {
        this.passTurn();
        clearInterval(this.timeToShotInterval);
      }
    }, 1000);
  }

  renderPlayer(team: string, player: any) {
    if(!this.players[player.id]) {
      this.players[player.id] = this.game.add.sprite(player.x, player.y, team);
      this.game.physics.p2.enable(this.players[player.id]);
      this.players[player.id].body.immovable = true;
      this.players[player.id].body.dynamic = false;
      this.players[player.id].body.collideWorldBounds = true;
      this.players[player.id].anchor.set(0.5);
      this.players[player.id].animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8], 9, true);
      this.players[player.id].animations.add('idle', [0], 10, true);
    }

    if(this.players[player.id]) {
      this.players[player.id].body.x = player.x;
      this.players[player.id].body.y = player.y;

      if(player.facing == 'left' || player.facing == 'right') {
        this.players[player.id].animations.play('walk');
        if(player.facing == 'left') {
          this.players[player.id].scale.x = 1;
        } else {
          this.players[player.id].scale.x = -1;
        }
      } else {
        this.players[player.id].animations.play('idle');
        this.players[player.id].animations.stop();
      }
    }
  }

}