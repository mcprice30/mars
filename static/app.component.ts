import { Component, NgModule, OnInit } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { RoverService } from './service/rover.service';

@Component({
  selector: 'app',
  styleUrls: ['.{{ static }}/app.component.css'],
  templateUrl: '{{ static }}/app.component.html',
})

export class AppComponent implements OnInit {
  show_splash: boolean = true;

  constructor(private _router: Router, private _roverService: RoverService) {}

  ngOnInit() {
    this._roverService.getRoverSol('curiosity', 0).then(data => {
      console.log(data);
    });

    this._roverService.getRoverCamera('curiosity', 0, 'chemcam').then(data => {
      console.log(data);
    });
  }
}
