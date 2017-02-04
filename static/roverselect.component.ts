import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverViewService} from './service/roverview.service';

@Component({
  selector: 'roverselect',
  styleUrls: ['.{{ static }}/roverselect.component.css'],
  templateUrl: '{{ static }}/roverselect.component.html',
})

export class RoverSelectComponent implements OnInit {
  rovers: Rover[] = [];

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
