import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest, RoverSol, RoverLocation} from './entity/Rover';
import {RoverService} from './service/rover.service';
import './OpenLayers.js';
import './marsmap.js';

@Component({
  selector: 'rover-map',
  styleUrls: [
    '.{{ static }}/theme/default/style.css',
    '.{{ static }}/rover-map.component.css',
  ],
  templateUrl: '{{ static }}/rover-map.component.html',
})

export class RoverMapComponent implements OnInit, OnChanges {

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

  roverStartData: any;

  constructor(private _roverService: RoverService) {
    this.roverStartData = {
      'curiosity': new RoverInit('curiosity', true, 1, 20, 11),
      'opportunity': new RoverInit('opportunity', false, 1, 9, 9),
      'spirit': new RoverInit('spirit', false, 1, 9, 9)
    }
  }

  // map variables
  useHighRes: boolean = undefined;
  minZoom: number = 0;
  maxZoom: number = 0;
  startZoom: number = 0;

  locationData: RoverLocation[] = undefined;

  loaded = false;

  ngOnInit() {
    var self = this;
    this.getRoverLocations(function() {
      useHighRes = self.roverStartData[self.rover].useHighRes;
      minZoom = self.roverStartData[self.rover].minZoom;
      maxZoom = self.roverStartData[self.rover].maxZoom;
      startZoom = self.roverStartData[self.rover].startZoom;
      init();
      drawPath(self.locationData);
      moveMarker(self.sol);
    });
  }

  getRoverLocations(callback) {
    this._roverService.getAllRoverLocations(this.rover).then(data => {
      this.locationData = data;
      callback();
    })
  }

  getRovers(callback) {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
			callback(rovers);
    });
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (this.locationData !== undefined) {
      moveMarker(changes['sol']['currentValue']);
    }
  }

  backButton() {
    this.mainViewChange.emit('rover-select');
  }
}

class RoverInit {
  constructor(name: string, useHighRes: boolean, minZoom: number, maxZoom: number, startZoom: number) {
    this.name = name;
    this.useHighRes = useHighRes;
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
    this.startZoom = startZoom;
  }
  name: string;
  useHighRes: boolean;
  minZoom: number;
  maxZoom: number;
  startZoom: number;
}