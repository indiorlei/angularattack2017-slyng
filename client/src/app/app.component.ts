import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import { AngularFire } from 'angularfire2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

	constructor(
    public authService: AuthService, 
    private router: Router,
    public af: AngularFire
  ) {
		this.router.navigate(['login']);
    this.authService.af.auth.subscribe(
      (auth) => {
        if(auth) {
          this.router.navigate(['']);
        } else {
        	this.router.navigate(['login']);
        }
      }
    );
  }

  logout() {
    this.authService.logout();
  }

}
