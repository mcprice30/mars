import { Component, NgModule } from '@angular/core'
import { RouterModule, Routes }  from '@angular/router';
import { RoverSelectComponent } from './roverselect.component';
import { CollageComponent } from './collage.component';
import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'roverselect', component: RoverSelectComponent },
  { path: 'collage', component: CollageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [ RouterModule ]
})
export class AppRouterModule {}
