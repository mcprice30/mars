import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'slider'
  styleUrls: ['.{{ static }}/slider.component.css'],
  templateUrl: '{{ static }}/slider.component.html'
})

export class SliderComponent implements OnInit {

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
    this.getRovers();
  }

  getRovers() {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
    });
  }

  toCaps(rover) {
    return rover.split(' ').map(i => i[0].toUpperCase() + i.substr(1).toLowerCase());
  }

}
