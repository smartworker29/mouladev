import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {SelectRoleComponent} from './select-role/select-role.component';
import {IsAuthenticated, HasNoHome} from '../auth/permissions';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home'
    },
    canActivate: [HasNoHome]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Signup'
    },
  },
  {
    path: 'access_token',
    component: LoginComponent
  },
  {
    path: 'role',
    component: SelectRoleComponent,
    data: {
      title: 'Select Role'
    },
    canActivate: [IsAuthenticated]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
