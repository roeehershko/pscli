import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {EmptyLayoutComponent} from '../../common/layouts/empty/empty.layout';
import {
  AuthGuardService
} from './services/auth-guard.service';
import { AuthService } from './services/auth.service';

import {LayoutModule} from '../../common/layouts/layout.module';


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
    LayoutModule,
    RouterModule.forRoot([
      {
        path: 'auth',
        component: EmptyLayoutComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: 'register',
            component: RegisterComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ]
})
export class SecurityModule {

}
