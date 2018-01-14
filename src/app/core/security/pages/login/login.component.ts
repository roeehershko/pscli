import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  public loginError: String;
  public loginForm: FormGroup;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required, <any>Validators.email]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(6)]),
    });

  }
  loginUser(loginData) {
    const self = this;

    self.authService.loginWithPassword(loginData.email, loginData.password, function (err, data) {
      if (err) {
        self.loginError = err.reason;
        console.log(err);
      } else {
        self.loginError = '';
        self.router.navigate(['/']);
      }
    });
  }

  logoutUser() {
    const self = this;
    self.authService.logout();
  }

  ngOnDestroy() {

  }
}
