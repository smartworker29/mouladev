import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from 'environments/environment';

@Component({
  selector: 'app-login-social',
  templateUrl: './social.component.html',
  styleUrls: [
    './social.component.scss',
    './social.component.portrait.css'
  ]
})

export class SocialComponent {
  oauth_redirect_uri = environment.oauth_redirect_uri;

  constructor(
    private router: Router
  ) { }
}
