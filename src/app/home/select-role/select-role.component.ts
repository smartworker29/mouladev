import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

import {RoleService} from '../../core/role.service';
import Roles from '../../core/models/Roles.enum';


@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: [
    './select-role.component.scss',
    './select-role.component.portrait.css'
  ],
  providers: [RoleService],
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('* => visible', [
        animate(500, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1})
        ]))
      ]),
      transition('visible => *', [
        animate(500, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class SelectRoleComponent implements OnInit {
  Roles = Roles;
  pageState = 'visible';

  constructor(
    private router: Router,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
  }

  setRole(role: Roles) {
    this.roleService.setPrimaryRole(role).subscribe(() => {
      this.roleService.setCurrentRole(role);
      this.pageState = 'hidden';
      if (role === Roles.Creator) {
        this.router.navigate(['/founder/idea/realization', {method: 'new'}]);
      } else if (role === Roles.Backer) {
        this.router.navigate(['/backer']);
      }
    });
  }

  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
    }
  }
}
