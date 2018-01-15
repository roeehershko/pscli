import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from '../../../security/services/auth.service';
import {Todos} from 'collections/todos';

@Component({
  selector: 'app-analytic-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.scss']
})
export class OverviewComponent  implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {
    const todos = Todos.find({
      title: 'test',
      price: { $gt: 5 }
    });
  }
}
