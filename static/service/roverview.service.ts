import {Component, NgModule, Injectable} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Rover, RoverManifest} from '../entity/Rover';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class RoverViewService {
  show_splash: boolean = true;

  constructor(private _http: Http) {}

  getRoverList(): Promise<Rover[]> {
    var roverList = [];
    return new Promise((resolve, reject) => {
      var roverList = [];
      this._http.get("{{ api }}/rovers").subscribe((res: Response) => {
        // normal handle
        var data = res.json().data;
        var roverEndpoints = []
        for (var property in data) {
          roverEndpoints.push(this._http.get("{{ api }}" + data[property]));
        }
        Observable.forkJoin(roverEndpoints).subscribe((res: Response[]) => {
          for (var i = 0; i < res.length; i++) {
            var roverData = res[i].json();
            var tempRover = new Rover();
            tempRover.manifest = roverData.data.manifest;
            tempRover.solPaths = roverData.data.solPaths;
            roverList.push(tempRover);
          }
          resolve(roverList);
        }, (err) => {
        }, () => {

        });
        // Fill template here.
      }, (err: Response) => {
        // on error
        resolve(roverList);
      }, () => {
        //finally
      });
    });
  }
}
