import {Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';

import {Accounts} from 'meteor/accounts-base';
import {User} from 'models/user';
import {Router} from "@angular/router";


@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerError: string;
  public userForm: FormGroup;

  constructor(private zone: NgZone, private router: Router) {}
  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required, <any>Validators.email]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(6)]),
      profile: new FormGroup({
        name: new FormControl('', [
          <any>Validators.required,
          <any>Validators.minLength(5),
        ]),
        phone: new FormControl('', [
          <any>Validators.required,
          <any>Validators.pattern(new RegExp(/\w+/)),
          <any>Validators.minLength(6)
        ]),
      })
    });
  }

  save(user: User) {
    const self = this;
    user.profile.primary_email = user.email;
    Accounts.createUser(user, function (err) {
      self.zone.run(() => {
        if (err) {
          self.registerError = err.reason;
        }
        else {
          self.registerError = '';
          self.router.navigate(['/']);
        }
      });
    });
  }

  ngOnDestroy() {

  }
}
