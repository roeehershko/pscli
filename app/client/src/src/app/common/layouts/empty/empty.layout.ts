import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-empty',
  templateUrl: 'empty.layout.html'
})

export class EmptyLayoutComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.body.classList.add('layout-empty');
  }
}
