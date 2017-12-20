import {Component, OnInit} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Todos} from '../../api/server/collections/todos';
import {Todo} from '../../api/server/models/todos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  todos: Todo[];
  todosIs = 'Todos Is';

  ngOnInit() {
    Todos.insert({
      title: 'hey todo',
      content: 'this is todo content'
    });

    Todos.find({}).subscribe((todos) => {
      this.todos = todos;
    });
  }
}
