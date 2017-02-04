import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'


@Component({
  selector: 'roverselect',
  styles: [`
    .robot-select {
      background: #f0e7e7;
      border-width: 5px;
      border-radius: 10px;	
      margin-top: 40px;
      margin-bottom: 40px;
    }
  `],
  templateUrl: '{{ static }}/roverselect.component.html',
})
export class RoverSelectComponent implements OnInit {

  ngOnInit() {
  }
}