import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {AppComponent} from './app.component'
import {SplashComponent} from './splash.component';
import {RoverSelectComponent} from './roverselect.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    SplashComponent,
    RoverSelectComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}