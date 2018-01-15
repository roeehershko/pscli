import {Component, OnInit} from '@angular/core';
import {Todos} from 'collections/todos';
import {Todo} from 'models/todos';
import {Meteor} from 'meteor/meteor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  todos: Todo[];

  ngOnInit() {
    Meteor.subscribe('todosData');

    Todos.find({}, ).subscribe((todos) => {
      this.todos = todos;
    });
  }
}
