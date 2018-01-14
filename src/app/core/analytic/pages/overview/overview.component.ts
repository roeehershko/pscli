import {Component, OnInit, OnDestroy} from '@angular/core';
import {Validators, FormGroup, FormControl} from '@angular/forms';
import {AuthService} from '../../../security/services/auth.service';

@Component({
  selector: 'app-analytic-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.scss']
})
export class OverviewComponent {
  constructor(public authService: AuthService) {}
}
