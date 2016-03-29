import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {
  IsAuthenticated,
  IsRegularUser,
  AccessTokenCheck,
  HasNoHome
} from './auth/permissions';

import {AppElementsModule} from './elements/elements.module'; /* TODO: delete after finishing EditDrawingComponent */
import {EditDrawingComponent} from './elements/edit-drawing/edit-drawing.component'; /* TODO: delete after finishing EditDrawingComponent */


export const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [AccessTokenCheck]
  },
  {
    path: 'founder',
    loadChildren: './founder/founder.module#FounderModule',
    canActivate: [IsAuthenticated]
  },
  {
    path: 'backer',
    loadChildren: './backer/backer.module#BackerModule',
    canActivate: [IsAuthenticated]
  },
  {
    path: 'test',
    loadChildren: './test/test.module#TestModule'
  },
  /* TODO: delete after finishing EditDrawingComponent */
  {
    path: 'drawing',
    component: EditDrawingComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AppElementsModule /* TODO: delete after finishing EditDrawingComponent */
  ],
  exports: [ RouterModule ],
  providers: [
    IsAuthenticated,
    IsRegularUser,
    AccessTokenCheck,
    HasNoHome
  ]
})
export class AppRoutingModule {}
