import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(public authService: AuthService, private router: Router) {}

  loginWithFacebook() {
    this.authService.loginWithFacebook().then((data) => {
      // Send them to the homepage if they are logged in
      this.router.navigate(['']);
    })
  }

}
