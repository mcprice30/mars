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
		ctx.fillStyle = '#f0e7e7';
		ctx.font = 'bold 30px sans-serif';
    this.boxes = {};
    var latitudes = [];
    var longitudes = [];
    this.getRovers(function(rovers) {
			for (var rover in rovers) {
				var locs = rovers[rover].manifest.locations;
				var loc = locs[locs.length-1];
        var temp = loc.longitude;
        loc.longitude = loc.latitude;
        loc.latitude = temp;
				loc.latitude = (loc.latitude+100)*canvas.width/360;
				loc.longitude = ((90-loc.longitude)*canvas.height/180;
        self.boxes[rovers[rover].manifest.name] = [loc.longitude - 15, loc.latitude - 10, loc.longitude + 15, loc.latitude + 200];
        latitudes.push(loc.latitude);
        longitudes.push(loc.longitude);
				ctx.fillText(rovers[rover].manifest.name, loc.latitude+20, loc.longitude+10);
				ctx.fill();
			}
      let roverImg = new Image;
      roverImg.onload = function() {
        for (let i = 0; i < latitudes.length; i++) {
          ctx.drawImage(roverImg, latitudes[i] - roverImg.width/2,
                       longitudes[i] - roverImg.height/2,
                       roverImg.width, roverImg.height);
        }
      }
      roverImg.src = "http://curiosityrover.com/mslicon.png";
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
