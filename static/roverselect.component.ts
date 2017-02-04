import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'rover-select',
  styleUrls: ['.{{ static }}/roverselect.component.css'],
  templateUrl: '{{ static }}/roverselect.component.html',
})

export class RoverSelectComponent implements OnInit {
  rovers: Rover[] = [];

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

  roverSelect(roverName: string) {
    console.log(roverName);
  }
}
