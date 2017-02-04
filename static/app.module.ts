import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component'
import {SplashComponent} from './splash.component';
import {RoverSelectComponent} from './roverselect.component';
import {RoverViewService} from './service/roverview.service';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    SplashComponent,
    RoverSelectComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    RoverViewService
  ]
})
export class AppModule {}