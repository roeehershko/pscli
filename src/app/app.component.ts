import {Component, OnInit} from '@angular/core';
import {Todos} from '../../api/server/collections/todos';
import {Todo} from 'models/todos';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  todos: Todo[];
  todosIs = 'Todos Is NOT 123';

  ngOnInit() {
    Todos.find({}, ).subscribe((todos) => {
      this.todos = todos;
    });

    Meteor.subscribe('todosList');
    Meteor.subscribe('userData');

    // Meteor.call('addTodo', {
    //   title: 'my todo',
    //   content: 'afwe182378129'
    // });
  }
}
