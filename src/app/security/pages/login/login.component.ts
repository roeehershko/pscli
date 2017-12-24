import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {Meteor} from 'meteor/meteor';
import {NgZone} from '@angular/core';
import {MeteorObservable} from 'meteor-rxjs';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginError: String;
  public loginForm: FormGroup;
  public autorunComputation: Tracker.Computation;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    const self = this;

    this.loginForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required, <any>Validators.email]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(10)]),
    });
  }
  loginUser(loginData) {
    const self = this;

    self.authService.loginWithPassword(loginData.email, loginData.password, function (err, data) {
      if (err && err.reason) {
        self.loginError = err.reason;
      } else {
        self.loginError = '';
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