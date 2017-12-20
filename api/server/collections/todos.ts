import { MongoObservable } from 'meteor-rxjs';
import { Todo } from '../models/todos';

export const Todos = new MongoObservable.Collection<Todo>('todos');
