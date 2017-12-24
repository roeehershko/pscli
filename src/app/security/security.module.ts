import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {SecurityComponent} from './layout/security.layout';
import {
  AuthGuardService
} from './services/auth-guard.service';
import { AuthService } from './services/auth.service';

@NgModule({
  providers: [
    AuthGuardService,
    AuthService,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'auth',
        component: SecurityComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'register',
            canActivate: [AuthGuardService],
            component: RegisterComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    SecurityComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class SecurityModule {

}
