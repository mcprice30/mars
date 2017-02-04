import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverViewService} from './service/roverview.service';

@Component({
  selector: 'slider'
  styleUrls: ['.{{ static }}/slider.component.css'],
  templateUrl: '{{ static }}/slider.component.html'
})

export class SliderComponent implements OnInit {

  constructor(private _roverViewService: RoverViewService) {

  }

  ngOnInit() {
    this.getRovers();
  }

  getRovers() {
    this._roverViewService.getRoverList().then(rovers => {
      this.rovers = rovers;
    });
  }
}
