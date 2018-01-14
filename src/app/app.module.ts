import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {SecurityModule} from './core/security/security.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AnalyticModule} from './core/analytic/analytic.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SecurityModule,
    RouterModule,
    AnalyticModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
