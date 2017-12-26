import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { SecurityModule } from './core/security/security.module';
import {RouterModule} from '@angular/router';
import {AuthGuardService} from './core/security/services/auth-guard.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SecurityModule,
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent,
        canActivate: [AuthGuardService],
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
