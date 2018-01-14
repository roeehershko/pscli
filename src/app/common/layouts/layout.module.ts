import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SidebarLayoutComponent} from './sidebar/sidebar.layout';
import {EmptyLayoutComponent} from './empty/empty.layout';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  providers: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    SidebarLayoutComponent,
    EmptyLayoutComponent,
  ]
})
export class LayoutModule {

}
