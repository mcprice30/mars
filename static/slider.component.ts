import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest, RoverSol} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'slider'
  styleUrls: ['.{{ static }}/slider.component.css'],
  templateUrl: '{{ static }}/slider.component.html'
})

export class SliderComponent implements OnInit, OnChanges {

  rovers: Rover[] = [];

  earthDate: string = "";

  thumbnails = [];

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
  solChange:EventEmitter<number> = new EventEmitter<number>();

  @Input()
  otherSol: number = 0;

  @Output()
  otherSolChange:EventEmitter<number> = new EventEmitter<number>();

  @Input()
  camera: string = "";

  @Output()
  cameraChange:EventEmitter<String> = new EventEmitter<String>();


  constructor(private _roverService: RoverService) {
  }

  ngOnInit() {
    var self = this;
    this.slider = $('#sol-slider');
    this.real = 0;
    this.loadImages = false;
  }

  getRovers(callback) {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
      callback(rovers)
    });
  }

  openCollage(rover: RoverWrapper) {
    console.log(rover.sol);
    this.solChange.emit(rover.sol);
    this.cameraChange.emit(rover.info.thumbnailCamera.toLowerCase());
    this.mainViewChange.emit('rover-collage');
  }

  toCaps(rover) {
    return rover.split(' ').map(i => i[0].toUpperCase() + i.substr(1).toLowerCase());
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		var self = this;
    if (changes['otherSol']) {
      self.getRovers(function(rovers) {
			  var rover = null;
			  for (var r in rovers) {
				  if (rovers[r].manifest.name.toLowerCase() == self.rover.toLowerCase() {
					  rover = rovers[r];
				  }
			  }
			  if (rover === null) {
				  return;
			  }
        self._roverService.getRoverSol(self.rover, self.real).then(data => {
          self.earthDate = data.earthDate;
          self.thumbnails = []
          for (let sol in data.nearestSols) {
            self._roverService.getRoverSol(self.rover, sol).then(data => {
              self.thumbnails.push(new RoverWrapper(sol, data));
            });
          }
        });
      })
    }
    if (!changes['mainView']) {
      return;
    }
    this.getRovers(function(rovers) {
			var rover = null;
			for (var r in rovers) {
				if (rovers[r].manifest.name.toLowerCase() == self.rover.toLowerCase() {
					rover = rovers[r];
				}
			}
			if (rover === null) {
				return;
			}
      var sols = Object.keys(rover.solPaths);
      self.sols = sols;
			for (var i in sols) {
				sols[i] = parseInt(sols[i]);
			}
      var slider = $('#sol-slider')
      slider.rangeslider({
        polyfill: false,
        onSlide: function(position, value) {
          self.real = value;
          var closest = closestSol(value, sols)
          self.sol = closest;
          self.solChange.emit(closest);
        },
        onSlideEnd: function(position, value) {
          self.real = value;
          var closest = closestSol(value, sols)
          self.sol = closest;
          self.solChange.emit(closest);
          self.otherSolChange.emit(closest);
          self._roverService.getRoverSol(self.rover, closest).then(data => {
          });
        }
      });
      var min = sols[0];
      var max = sols[sols.length-1];
      slider.attr('min', min);
      slider.attr('max', max);
      slider.attr('step', Math.round(max/sols.length));
      slider.attr('value', self.real);
      var closest = closestSol(self.real, sols)
      self.sol = closest;
      self.solChange.emit(closest);
      slider.rangeslider('update', true);
    });
  }

  function closestSol(value, sols) {
    var closest = sols[0];
    var dist = Infinity;
    for (var i in sols) {
      if (Math.abs(sols[i]-value) < dist) {
        closest = sols[i]
        dist = Math.abs(sols[i]-value);
      }
    }
    return closest;
  } 
}

class RoverWrapper {
  constructor(sol: number, info: RoverSol) {
    this.sol = sol;
    this.info = info;
  }
  sol: number;
  info: RoverSol;
}