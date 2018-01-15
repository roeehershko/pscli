import {Component, OnInit} from '@angular/core';
import {Todo} from 'models/todos';
import {Meteor} from 'meteor/meteor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  todos: Todo[];
}
