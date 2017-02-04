import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'rover-map',
  styleUrls: ['.{{ static }}/roverselect.component.css'],
  templateUrl: '{{ static }}/roverselect.component.html',
})

export class RoverMapComponent implements OnInit {

  rovers: Rover[] = [];

  @Input()
  mainView: string = "";

  @Output()
  mainViewChange:EventEmitter<String> = new EventEmitter<String>();

  @Input()
  rover: string = "";

  @Output()
  roverChange:EventEmitter<String> = new EventEmitter<String>();

  @Input()
  sol: number = 0;

  @Output()
  solChange:EventEmitter<Number> = new EventEmitter<Number>();

  @Input()
  camera: string = "";

  @Output()
  cameraChange:EventEmitter<String> = new EventEmitter<String>();

  constructor(private _roverService: RoverService) {

  }

  ngOnInit() {
    var self = this;
    console.log(self.rover);
  }

  getRovers(callback) {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
			callback(rovers);
    });
  }

  roverSelect(roverName: string) {
    console.log(roverName);
  }
}
