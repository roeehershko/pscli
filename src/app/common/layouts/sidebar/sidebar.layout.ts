import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AuthService} from '../../../core/security/services/auth.service';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: 'sidebar.layout.html'
})

export class SidebarLayoutComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document, public authService: AuthService) {}

  ngOnInit() {
    this.document.body.classList.add('layout-sidebar');
  }
}
