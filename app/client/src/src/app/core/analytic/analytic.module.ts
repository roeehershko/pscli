import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import {SidebarLayoutComponent} from '../../common/layouts/sidebar/sidebar.layout';
import {OverviewComponent} from './pages/overview/overview.component';
import {LayoutModule} from '../../common/layouts/layout.module';
import {AuthGuardService} from '../security/services/auth-guard.service';


@NgModule({
  providers: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: SidebarLayoutComponent,
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: OverviewComponent
          }
        ]
      }
    ])
  ],
  declarations: [
    OverviewComponent
  ]
})
export class AnalyticModule {

}
