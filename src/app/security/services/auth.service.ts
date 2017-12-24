import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class AuthService {
  public autorunComputation: Tracker.Computation;
  public user;
  public zone;
  public isLogged;
  public loginErr;
  public cbs = [];
  constructor(zone: NgZone) {
    this.zone = zone;
    this._initAutorun();
    Meteor.subscribe('userData');

    this.user = Meteor.user();
  }

  public isAuthenticated(): boolean {
    return !! this.isLogged;
  }

  public loginWithPassword(email, pass, cb) {
    const self = this;
    Meteor.loginWithPassword(email, pass, function (err) {
      if (err) {
        self.zone.run(() => {
          cb(err);
        });
      } else {
        cb(null);
        self.user = Meteor.user();
      }
    });
  }

  public logout(): void {
    Meteor.logout();
  }
  _initAutorun(): void {
    const self = this;
    this.autorunComputation = Tracker.autorun(() => {
      self.zone.run(() => {
        self.user = Meteor.user();
        self.isLogged = !! Meteor.userId();
      });
    });
  }
}
