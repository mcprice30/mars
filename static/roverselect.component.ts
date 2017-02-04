import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
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
    var canvas = document.getElementById('rover-canvas');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
	  var ctx = canvas.getContext('2d');
		var img = new Image;
		ctx.imageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		img.onload = function() {
			ctx.drawImage(img, 0, 0, img.width,    img.height,
                   	 	 	 0, 0, canvas.width, canvas.height);
		};
		img.src = '{{ static }}/rover-select.png';
		ctx.fillStyle = '#3333ff';
		ctx.font = 'bold 30px sans-serif';
    this.boxes = {};
    this.getRovers(function(rovers) {
			for (var rover in rovers) {
				var locs = rovers[rover].manifest.locations;
				var loc = locs[locs.length-1];
				loc.latitude = ((loc.latitude+360)%360)*canvas.width/720;
				loc.longitude = ((loc.longitude+360)%360)*canvas.height/720;
        self.boxes[rovers[rover].manifest.name] = [loc.longitude - 15, loc.latitude - 10, loc.longitude + 15, loc.latitude + 200];
				ctx.beginPath();
				ctx.arc(loc.latitude, loc.longitude, 10, 0, Math.PI*2, true);
				ctx.closePath();
				ctx.fillText(rovers[rover].manifest.name, loc.latitude+20, loc.longitude+10);
				ctx.fill();
			}
      canvas.addEventListener('click', function(e) {
        for (var box in self.boxes) {
          if self.insideRectangle([e.clientX, e.clientY], self.boxes[box]) {
            self.mainView = "rover-map";
            self.rover = box.toLowerCase();
            self.roverChange.emit(self.rover);
            self.mainViewChange.emit(self.mainView);
            break;
          }
        }
      });
		});
  }

  insideRectangle(p, rect) {
    if (p[1] < rect[0] || p[1] > rect[2]) {
      return false;
    }
    if (p[0] < rect[1] || p[0] > rect[3]) {
      return false;
    }
    return true;
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
