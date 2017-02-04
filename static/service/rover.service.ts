import { Component, NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Rover, RoverManifest, RoverSol, RoverCamera, RoverImage } from '../entity/Rover';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class RoverService {
  show_splash: boolean = true;

  constructor(private _http: Http) {}

  getRoverList(): Promise<Rover[]> {
    var roverList = [];
    return new Promise((resolve, reject) => {
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
            var solPath = new Map<number, string>();
            for (var solNum in roverData.data.solPaths) {
              solPath[Number(solNum)] = roverData.data.solPaths[solNum];
            }
            tempRover.solPaths = solPath;
            roverList.push(tempRover);
          }
          resolve(roverList);
        }, (err) => {
        }, () => {

        });
      }, (err: Response) => {
        // on error
        resolve(roverList);
      }, () => {
        //finally
      });
    });
  };

  getRoverSolByPath(solPath: string): Promise<RoverSol> {
    var roverSol = new RoverSol();
    return new Promise((resolve, reject) => {
      this._http.get(`{{ api }}${solPath}`).subscribe((res: Response) => {
        // normal response
        var jsonData = res.json().data;
        roverSol.cameraPaths = jsonData.cameraPaths;
        roverSol.earthDate = jsonData.earthDate;
        roverSol.latitude = jsonData.latitude;
        roverSol.longitude = jsonData.longitude;
        var nearestSols = new Map<number, string>();
        for (var solNum in jsonData.nearestSols) {
          nearestSols[Number(solNum)] = jsonData.nearestSols[solNum];
        };
        roverSol.nearestSols = nearestSols;
        roverSol.thumbnailCamera = jsonData.thumbnailCamera;
        roverSol.thumbnailURL = jsonData.thumbnailURL;
        roverSol.totalPhotos = jsonData.totalPhotos;
        resolve(roverSol);
      }, (err: Response) => {
        // handle error
        console.log(`Failed to fetch the data for ${solPath}.`);
        resolve(roverSol);
      }, () => {
        // finally
      })
    });
  };

  getRoverSol(roverName: string, sol: number): Promise<RoverSol> {
    var roverSol = new RoverSol();
    return new Promise((resolve, reject) => {
      this._http.get(`{{ api }}/rovers/${roverName}/${sol}`).subscribe((res: Response) => {
        // normal response
        var jsonData = res.json().data;
        roverSol.cameraPaths = jsonData.cameraPaths;
        roverSol.earthDate = jsonData.earthDate;
        roverSol.latitude = jsonData.latitude;
        roverSol.longitude = jsonData.longitude;
        var nearestSols = new Map<number, string>();
        for (var solNum in jsonData.nearestSols) {
          nearestSols[Number(solNum)] = jsonData.nearestSols[solNum];
        };
        roverSol.nearestSols = nearestSols;
        roverSol.thumbnailCamera = jsonData.thumbnailCamera;
        roverSol.thumbnailURL = jsonData.thumbnailURL;
        roverSol.totalPhotos = jsonData.totalPhotos;
        resolve(roverSol);
      }, (err: Response) => {
        // handle error
        console.log(`Failed to fetch the data for ${roverName} on the ${sol} Sol.`);
        resolve(roverSol);
      }, () => {
        // finally
      })
    });
  };

  getRoverCameraByPath(cameraPath: string): Promise<RoverCamera> {
    var roverCamera = new RoverCamera();
    var resolved = false;
    return new Promise((resolve, reject) => {
      this._http.get(`{{ api }}${cameraPath}`).subscribe((res: Response) => {
        // normal response
        var jsonData = res.json().data;
        for (var i = 0; i < jsonData.images.length; i++) {
          var tempRoverImage = new RoverImage();
          tempRoverImage.earthDate = jsonData.images[i].earthDate;
          tempRoverImage.url = jsonData.images[i].url;
          roverCamera.images.push(tempRoverImage);
        }
        resolved = true;
        resolve(roverCamera);
      }, (err: Response) => {
        // handle error
        console.log(`Failed to fetch the data for ${cameraPath}.`);
        resolve(roverCamera);
      }, () => {
        // finally
        if (!resolved) {
          resolve(roverCamera);
        }
      })
    });
  }

  getRoverCamera(roverName: string, sol: number, cameraName: string): Promise<RoverCamera> {
    var roverCamera = new RoverCamera();
    var resolved = false;
    return new Promise((resolve, reject) => {
      this._http.get(`{{ api }}/rovers/${roverName}/${sol}/${cameraName}`).subscribe((res: Response) => {
        // normal response
        var jsonData = res.json().data;
        for (var i = 0; i < jsonData.images.length; i++) {
          var tempRoverImage = new RoverImage();
          tempRoverImage.earthDate = jsonData.images[i].earthDate;
          tempRoverImage.url = jsonData.images[i].url;
          roverCamera.images.push(tempRoverImage);
        }
        resolved = true;
        resolve(roverCamera);
      }, (err: Response) => {
        // handle error
        console.log(`Failed to fetch the data for ${roverName} on the ${sol} Sol.`);
        resolve(roverCamera);
      }, () => {
        // finally
        if (!resolved) {
          resolve(roverCamera);
        }
      })
    });
  }
}
