import {Component, NgModule, OnInit, Input} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'rover-collage',
  styleUrls: ['.{{ static }}/collage.component.css'],
  templateUrl: '{{ static }}/collage.component.html',
})

export class CollageComponent implements OnInit {
  
  @Input()
  rover: string = "curiosity";

  @Input()
  sol: number = 0;

  @Input()
  camera: string = "fhaz";

  constructor(private _roverService: RoverService) {}

  ngOnInit() {
    this.refreshCollage();
  }

  collageOptions = {
    fitWidth: true
  }

  roverImages = []

  refreshCollage() {
    this._roverService.getRoverCamera(this.rover, this.sol, this.camera).then(data => {
      this.roverImages = data.images;
      console.log(data.images.length);
    })
  };
}