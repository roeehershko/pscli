import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SidebarLayoutComponent} from './sidebar/sidebar.layout';
import {EmptyLayoutComponent} from './empty/empty.layout';
import {MatListModule, MatNavList, MatSidenavModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  providers: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule
  ],
  declarations: [
    SidebarLayoutComponent,
    EmptyLayoutComponent
  ]
})
export class LayoutModule {

}
