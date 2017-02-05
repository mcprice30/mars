import { Component, NgModule, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Rover, RoverManifest, RoverCamera, RoverSol } from './entity/Rover';
import { RoverService } from './service/rover.service';

@Component({
  selector: 'rover-collage',
  styleUrls: ['.{{ static }}/collage.component.css'],
  templateUrl: '{{ static }}/collage.component.html',
})

export class CollageComponent implements OnInit, OnChanges {

  @Input()
  mainView: string = "";

  @Output()
  mainViewChange:EventEmitter<String> = new EventEmitter<String>();
  
  @Input()
  rover: string = "curiosity";

  @Input()
  sol: number = 0;

  @Input()
  camera: string = "fhaz";

  imageAmount = 20;

  roverImages = []

  roverInfo: RoverSol = new RoverSol();

  cameraNames: CameraButton[] = []

  selectedCamera: CameraButton = undefined;

  constructor(private _roverService: RoverService) {}

  ngOnInit() {
    var self = this;
    this.refreshCollage(function () {
      self._roverService.getRoverSol(self.rover, self.sol).then(solData => {
        self.roverInfo = solData;
        for (var property in solData.cameraPaths) {
          var tempCameraButton = new CameraButton(property);
          tempCameraButton.style_selected['background'] = '#212121';
          tempCameraButton.style_selected['color'] = '#c1440e';
          if (self.camera === tempCameraButton.name.toLowerCase()) {
            tempCameraButton.style_selected['background'] = '#111111';
            tempCameraButton.style_selected['color'] = '#fda600';
            self.selectedCamera = tempCameraButton;
          }
          self.cameraNames.push(tempCameraButton);
        }
      });
    });
  }

  collageOptions = {
    fitWidth: true
  }

  refreshCollage(callback) {
    this._roverService.getRoverCamera(this.rover, this.sol, this.camera).then(data => {
      this.roverImages = data.images;
      callback();
    });
  };

  selectCamera(cameraName: CameraButton) {
    this.selectedCamera.style_selected['background'] = '#212121';
    this.selectedCamera.style_selected['color'] = '#c1440e';
    this.selectedCamera = cameraName;
    this.selectedCamera.style_selected['background'] = '#111111';
    this.selectedCamera.style_selected['color'] = '#fda600';
    this.camera = cameraName.name.toUpperCase();
    this.refreshCollage(function () {});
  };

  backButton() {
    this.mainViewChange.emit('rover-map');
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    console.log(changes);
    if (this.selectCamera !== undefined) {
      if (changes['sol'] !== undefined) {
        this.refreshCollage(function() {});
      }
    }
  }
}

class CameraButton {
  constructor(newName: string) {
    this.name = newName;
    this.style_selected = new Map<string, string>();
  }
  name: string;
  style_selected: Map<string, string>;
}