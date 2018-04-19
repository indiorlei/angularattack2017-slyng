import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'game/:id', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
