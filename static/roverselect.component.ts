import {Component, NgModule, OnInit, ViewEncapsulation} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'roverselect',
  // styles: [`
  //   .robot-select {
  //     background: #f0e7e7;
      
  //   }
  // `],
  styleUrls: ['{{ static }}/roverselect.component.css']
  templateUrl: '{{ static }}/roverselect.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RoverSelectComponent implements OnInit {

  ngOnInit() {
  }
}