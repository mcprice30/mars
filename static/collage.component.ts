import {Component, NgModule, OnInit, Input} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

@Component({
  selector: 'collage-component',
  styleUrls: ['.{{ static }}/collage.component.css'],
  templateUrl: '{{ static }}/collage.component.html',
})

export class CollageComponent implements OnInit {
  
  @Input()
  sol: number = 0;

  @Input()
  camera: string = "";

  constructor(private _roverService: RoverService) {

  }

  bricks = [
     {title: 'Brick 1'},
     {title: 'Brick 2'},
     {title: 'Brick 3'},
     {title: 'Brick 4'},
     {title: 'Brick 5'},
     {title: 'Brick 6'}
   ]
}