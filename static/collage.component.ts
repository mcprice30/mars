import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverViewService} from './service/roverview.service';

@Component({
  selector: 'collage-component',
  styleUrls: ['.{{ static }}/collage.component.css'],
  templateUrl: '{{ static }}/collage.component.html',
})

export class CollageComponent implements OnInit {
  rovers: Rover[] = [];

  constructor(private _roverViewService: RoverViewService) {

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