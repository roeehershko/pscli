import { Meteor } from 'meteor/meteor';
import {Todos} from 'collections/todos';
import {Accounts} from 'meteor/accounts-base';

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('todosList', function () {
    return Todos.find({});
  });

  Meteor.publish('userData', function () {
    return Meteor.users.find({_id: this.userId});
  });

  Meteor.methods({
    addTodo: function () {
      Todos.insert({
        title: 'my todo',
        content: 'fkejwehef'
      });
    }
  });

});
