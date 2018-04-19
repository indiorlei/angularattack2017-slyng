import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { 
  AngularFireModule, 
  AuthMethods, 
  AuthProviders 
} from "angularfire2";

import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { RoomComponent } from './components/room/room.component';
import { LobbyCreateRoomComponent } from './components/lobby/lobby-create-room/lobby-create-room.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyBxbGt85UMpMKN0UUSmKdNi81M6RL0IsiQ',
  authDomain: 'slyng-cbbc2.firebaseapp.com',
  databaseURL: 'https://slyng-cbbc2.firebaseio.com',
  storageBucket: 'slyng-cbbc2.appspot.com',
  messagingSenderId: '1097242439252'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent,
    GameComponent,
    RoomComponent,
    LobbyCreateRoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig,{
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    })
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
