import { Meteor } from 'meteor/meteor';
import {Todos} from 'collections/todos';
import {Campaigns} from "collections/campaigns";

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('todosData', function () {
    return Todos.find({ _id: 5 });
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
    },
    createCampaign: function (data) {
        Campaigns.insert({
            title: data.title,
            endpoints: data.endpoints,
            pixels: data.pixels
        });
    }
  });

});
