import { Component, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule, Routes }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component'
import { RoverSelectComponent } from './roverselect.component';
import { RoverMapComponent } from './rover-map.component';
import { RoverService } from './service/rover.service';
import { HttpModule } from '@angular/http';
import { MasonryModule } from 'angular2-masonry';
import { CollageComponent } from './collage.component';
import { AppRouterModule } from './app-router.module';
import { SliderComponent } from './slider.component';
import { RouterComponent } from './router.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MasonryModule,
    AppRouterModule
  ],
  declarations: [
    AppComponent,
    RoverSelectComponent,
    RoverMapComponent,
    CollageComponent,
    SliderComponent,
    RouterComponent
  ],
  bootstrap: [ RouterComponent ],
  providers: [
    RoverService
  ]
})
export class AppModule {}
