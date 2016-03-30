import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {HomeComponent} from './home.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SelectRoleComponent} from './select-role/select-role.component';
import {SocialComponent} from './login/social/social.component';
import {HomeRoutingModule} from './home.routing';
import {NavbarModule} from 'app/core/navbar/navbar.module';
import {AppElementsModule} from 'app/elements/elements.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppElementsModule,
    HomeRoutingModule,
    NavbarModule,
    AppElementsModule
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    SignupComponent,
    SelectRoleComponent,
    SocialComponent

  ]
})
export class HomeModule {}
