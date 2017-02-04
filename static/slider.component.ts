import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'slider'
  styleUrls: ['.{{ static }}/slider.component.css'],
  templateUrl: '{{ static }}/slider.component.html'
})

export class SliderComponent implements OnInit {

  constructor(private _roverService: RoverService) {

  }

  ngOnInit() {
    this.getRovers();
  }

  getRovers() {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
    });
  }
}
