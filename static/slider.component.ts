import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'slider'
  styleUrls: ['.{{ static }}/slider.component.css'],
  templateUrl: '{{ static }}/slider.component.html'
})

export class SliderComponent implements OnInit, OnChanges {

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
  solChange:EventEmitter<number> = new EventEmitter<number>();

  @Input()
  camera: string = "";

  @Output()
  cameraChange:EventEmitter<String> = new EventEmitter<String>();


  constructor(private _roverService: RoverService) {

  }

  ngOnInit() {
		var self = this;
  }

  getRovers(callback) {
    this._roverService.getRoverList().then(rovers => {
      this.rovers = rovers;
      callback(rovers)
    });
  }

  toCaps(rover) {
    return rover.split(' ').map(i => i[0].toUpperCase() + i.substr(1).toLowerCase());
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		var self = this;
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
			for (var i in sols) {
				sols[i] = parseInt(sols[i]);
			}
      var slider = $('#sol-slider')
      slider.rangeslider({
        polyfill: false,
        onSlide: function(position, value) {
          self.sol = value;
          self.solChange.emit(self.sol);
        }
      });
      var min = sols[0];
      var max = sols[sols.length-1];
      slider.attr('min', min);
      slider.attr('max', max);
      slider.attr('step', Math.round(max/sols.length));
      slider.attr('value', Math.round((max-min)/2));
      slider.val(0).change();
      self.sol = 0;
      self.solChange.emit(self.sol);
      slider.rangeslider('update', true);
    });
  }

}
