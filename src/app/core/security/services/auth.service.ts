import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class AuthService {
  public autorunComputation: Tracker.Computation;
  public user;
  public zone;
  public isLogged;

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
        self.zone.run(() => {
          cb(null);
          self._initAutorun();
        });
      }
    });
  }

  public createUser(user, cb) {
    const self = this;

    Accounts.createUser(user, function (err) {
      self.zone.run(() => {
        if (err) {
          cb(err.reason);
        }
        else {
          self._initAutorun();
          cb(null);
        }
      });
    });
  }

  public logout(): void {
    Meteor.logout();
    this._initAutorun();
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
