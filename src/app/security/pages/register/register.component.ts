import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';

import {Accounts} from 'meteor/accounts-base';
import {User} from 'models/user';


@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

    public userForm: FormGroup;

    ngOnInit() {
        this.userForm = new FormGroup({
            email: new FormControl('', [ <any>Validators.required, <any>Validators.email ]),
            password: new FormControl('', [ <any>Validators.required, <any>Validators.minLength(10)]),
            profile: new FormGroup({
                name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
                phone: new FormControl('', [
                  <any>Validators.required,
                  <any>Validators.pattern(new RegExp(/\w+/)),
                  <any>Validators.minLength(5)
                ]),
            })
        });
    }

  save(user: User) {
    Accounts.createUser(user, function (err) {
      console.log(err);
    });
  }
    ngOnDestroy() {

    }
}
