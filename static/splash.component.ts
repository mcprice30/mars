import {Component, NgModule, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Router} from '@angular/router';

@Component({
  styles: [`
    .vertical-center {
      min-height: 100%;  /* Fallback for browsers do NOT support vh unit */
      min-height: 100vh; /* These two lines are counted as one :-)       */

      display: flex;
      align-items: center;
    }
    .title {
      font-size: 70px;
      color: #c1440e;
    }
    .subtitle {
      color: #f0e7e7;
      margin-top: 0px !important;
    }
    .line {
      display: block;
      height: 1px;
      border: 0px;
      border-top: 1px solid;
      margin: 1em 0;
      padding: 0;
      color: #451804;
    }
  `],
  templateUrl: '{{ static }}/splash.component.html',
})
export class SplashComponent implements OnInit {
  word: string = 'random'

  constructor(private _router: Router) {}

  ngOnInit() {
    var thing = this;
    setTimeout(function() {
      thing._router.navigate(['/app'])
    }, 1000);
  }
}