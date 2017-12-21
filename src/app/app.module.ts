import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';

// App Modules
import {SecurityModule} from './security/security.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SecurityModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
