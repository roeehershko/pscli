/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module 'meteor/accounts-base' {
  import { Meteor } from 'meteor/meteor';

  export module Accounts {
    function addEmail(userId: string, newEmail: string, verified?: boolean): void;
    function changePassword(oldPassword: string, newPassword: string, callback?: Function): void;
    function createUser(options: {
      username?: string;
      email?: string;
      password?: string;
      profile?: Object;
    }, callback?: Function): string;
    var emailTemplates: Meteor.EmailTemplates;
    function findUserByEmail(email: string): Object;
    function findUserByUsername(username: string): Object;
    function forgotPassword(options: {
      email?: string;
    }, callback?: Function): void;
    function onEmailVerificationLink(callback: Function): void;
    function onEnrollmentLink(callback: Function): void;
    function onResetPasswordLink(callback: Function): void;
    function removeEmail(userId: string, email: string): void;
    function resetPassword(token: string, newPassword: string, callback?: Function): void;
    function sendEnrollmentEmail(userId: string, email?: string): void;
    function sendResetPasswordEmail(userId: string, email?: string): void;
    function sendVerificationEmail(userId: string, email?: string): void;
    function setPassword(userId: string, newPassword: string, options?: {
      logout?: Object;
    }): void;
    function setUsername(userId: string, newUsername: string): void;
    var ui: {
      config(options: {
        requestPermissions?: Object;
        requestOfflineToken?: Object;
        forceApprovalPrompt?: Object;
        passwordSignupFields?: string;
      }): void;
    };
    function verifyEmail(token: string, callback?: Function): void;
    function config(options: {
      sendVerificationEmail?: boolean;
      forbidClientAccountCreation?: boolean;
      restrictCreationByEmailDomain?: string | Function;
      loginExpirationInDays?: number;
      oauthSecretKey?: string;
    }): void;
    function onLogin(func: Function): { stop: () => void };
    function onLoginFailure(func: Function): { stop: () => void };
    function user(): Meteor.User;
    function userId(): string;
    function loggingIn(): boolean;
    function logout(callback?: Function): void;
    function logoutOtherClients(callback?: Function): void;
    function onCreateUser(func: Function): void;
    function validateLoginAttempt(func: Function): { stop: () => void };
    function validateNewUser(func: Function): boolean;
  }
}
