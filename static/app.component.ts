import {Component, NgModule, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Router} from '@angular/router';

@Component({
  selector: 'app',
  styleUrls: ['.{{ static }}/app.component.css'],
  templateUrl: '{{ static }}/app.component.html',
})

export class AppComponent implements OnInit {
  show_splash: boolean = true;

  constructor(private _router: Router) {}

  ngOnInit() {
    var thing = this;
    setTimeout(function() {
      thing._router.navigate(['/roverselect'])
    }, 1000);
  }
}
