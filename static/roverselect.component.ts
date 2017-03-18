import {Component, NgModule, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {Rover, RoverManifest} from './entity/Rover';
import {RoverService} from './service/rover.service';

import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts/src/index';

@Component({
  selector: 'rover-select',
  styleUrls: ['.{{ static }}/roverselect.component.css'],
  templateUrl: '{{ static }}/roverselect.component.html',
})

export class RoverSelectComponent implements OnInit {

  rovers: Rover[] = [];
  activeRover: string = "";

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
  solChange:EventEmitter<Number> = new EventEmitter<Number>();

  @Input()
  camera: string = "";

  @Output()
  cameraChange:EventEmitter<String> = new EventEmitter<String>();

  constructor(private _roverService: RoverService) {

  }

  ngOnInit() {

    var rovers = [
         {
                 lat:  -14.6029619898,
                 lon:  175.525814298,
                 name: "Spirit"
         },{
                 lat: -2.31267193421,
                 lon: -5.34801458957,
                 name: "Opportunity"
         },{
                 lat: -4.711008263280026,
                 lon: 137.35747239276338,
                 name: "Curiosity"
         }
    ];


    var scene = new THREE.Scene();

    var width = window.innerWidth;
    var height = window.innerHeight * 0.75;

    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    var parent = document.getElementById("viewCanvas");

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    const controls = new OrbitControls(camera, renderer.domElement);
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial();

    var roverObjs = [];

    material.map = THREE.ImageUtils.loadTexture('static/mars_1k_color.jpg');
    material.bumpMap = THREE.ImageUtils.loadTexture('static/marsbump1k.jpg');
    material.bumpScale = 0.05;
    var sphere = new THREE.Mesh(geometry, material);
    sphere.name = "Mars";
    scene.add(sphere);
    roverObjs.push(sphere);

    var lightPositions = [
       {x: 3, z: 3},
       {x: -3, z: 3},
       {x: 3, z: -3},
       {x: -3, z: -3},
    ]

    for (var i = 0; i < lightPositions.length; i++) {
       var pos = lightPositions[i];
       var light = new THREE.DirectionalLight(0xcccccc);
       light.position.set(pos.x, 0, pos.z);
       scene.add(light);
    }

    for (var i = 0; i < rovers.length; i++) {
       var rover = rovers[i];
       var phi = (90 - rover.lat) * Math.PI / 180;
       var theta = (rover.lon + 180) * Math.PI / 180;
       var x = -1 * Math.sin(phi) * Math.cos(theta);
       var y = Math.cos(phi);
       var z = Math.sin(phi) * Math.sin(theta);
       var roverGeometry = new THREE.SphereGeometry(0.05, 32, 32);
       var roverMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
       var roverMesh = new THREE.Mesh(roverGeometry, roverMaterial);
       roverMesh.name = rover.name;
       roverMesh.position.set(x, y, z);
       scene.add(roverMesh);
       roverObjs.push(roverMesh);
    }

    camera.position.z = 2;

    parent.appendChild(renderer.domElement);
    parent.addEventListener('mousemove', function(event){
      var mouse = new THREE.Vector2();
      var raycaster = new THREE.Raycaster();

      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(roverObjs);

      if (intersects.length > 0 && intersects[0].object.name !== "Mars") {
          event.preventDefault();
          self.activeRover = intersects[0].object.name;
      } else {
          self.activeRover = "";
      }
    }, false);

    var self = this;
    parent.addEventListener('mousedown', function(event){
      var mouse = new THREE.Vector2();
      var raycaster = new THREE.Raycaster();

      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(roverObjs);

      if (intersects.length > 0 && intersects[0].object.name !== "Mars") {
          self.mainView = "rover-map";
          self.rover = intersects[0].object.name.toLowerCase();
          self.roverChange.emit(self.rover);
          self.mainViewChange.emit(self.mainView);
          self.activeRover = intersects[0].object.name;
      } else {
          self.activeRover = "";
      }
    }, false);

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
  }

}
