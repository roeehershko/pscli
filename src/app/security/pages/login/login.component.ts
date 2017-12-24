import {Component, OnInit, OnDestroy} from '@angular/core';

import {Meteor} from 'meteor/meteor';


@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    public login: { email: string, password: string };
    public loginError: String;
    public user;

    ngOnInit() {
        if (Meteor.userId()) {
            Meteor.logout();
        }
    }

    loginUser() {
        const self = this;
        Meteor.loginWithPassword(this.login.email, this.login.password, function (err) {
            if (err && err.reason) {
                self.loginError = err.reason;
            } else {
                self.loginError = '';
                self.user = Meteor.user();
            }
        });
    }

    ngOnDestroy() {

    }
}
