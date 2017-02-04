import {Component, NgModule, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'app',
  styles: [`
    
  `],
  templateUrl: '{{ static }}/app.component.html',
})

export class AppComponent implements OnInit {
  show_splash: boolean = true;

  ngOnInit() {
    var thing = this;
    setTimeout(function() {
      thing.show_splash = false;
    }, 1000);
  }
}
