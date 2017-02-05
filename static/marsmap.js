var map, layer;
var locations;
var markers = new OpenLayers.Layer.Markers( "Markers" );
var roverMarker;
var mslsize = new OpenLayers.Size(32,32);
var msloffset = new OpenLayers.Pixel(-(mslsize.w/2), -mslsize.h + 5);
var mslicon = new OpenLayers.Icon('http://curiosityrover.com/mslicon.png', mslsize, msloffset);

// Map Bounds
var mapBounds_full = new OpenLayers.Bounds(-180.000000, -90.0, 180.0, 90.0);
var mapBounds_ctx = new OpenLayers.Bounds(136.696260, -5.333154, 137.862717, -4.132530);
var mapBoundsBASE = new OpenLayers.Bounds( 137.380794, -4.64535890429, 137.465011675, -4.53738741241);
var mapBoundsLR018854 = new OpenLayers.Bounds( 137.359362, -4.679285, 137.401471, -4.637177);
var mapBoundsLR09650 = new OpenLayers.Bounds(137.252440, -4.801559, 137.377471, -4.665560);
var mapBoundsLR09149 = new OpenLayers.Bounds(137.348560, -4.789745, 137.469506, -4.654738);

var roverLongitude = 180.0;
var roverLatitude = 0.0;


var minZoom = 1;
var maxZoom = 20;
var startZoom = 11;

var useHighRes = true;

var mvnzoom = 8;
function init() {
    var options = {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.KeyboardDefaults()
        ],
        projection: "EPSG:900913",
        displayProjection: "EPSG:4326",
        units: "m",
        fractionalZoom: false,
        numZoomLevels: 19,
        maxResolution: 156543.0339
    };

    map = new OpenLayers.Map('map', options);


    var nasaMapOverlay = new OpenLayers.Layer.TMS("NASA explore map",
        "http://ec2-54-241-20-2.us-west-1.compute.amazonaws.com/catalog/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/", {
            type: 'png',
            getURL: overlay_getNASATileURL,
            alpha: false,
            isBaseLayer: false,
            tileOrigin: new OpenLayers.LonLat(0, -90)
    });

    if (useHighRes) {

        ctx = new OpenLayers.Layer.XYZ("MRO CTX",
            "https://s3.amazonaws.com/GaleMap1/GaleCTXadj4/${z}/${x}/${y}.png", {
                transitionEffect: 'resize',
                type: 'png',
                alpha: false,
                isBaseLayer: false,
                minZoomLevel: 8,
                maxZoomLevel: 14,
                numZoomLevels: 19,
                getURL: ctxTileURL
        });

        var tmsoverlay = new OpenLayers.Layer.TMS("HiRISE",
            "https://s3.amazonaws.com/GaleMap1/trans/", {
                type: 'png',
                getURL: overlay_getTileURL,
                alpha: false,
                isBaseLayer: false
        });

        var tmsoverlayLR018854 = new OpenLayers.Layer.TMS("HiRISE ESP018854",
            "https://s3.amazonaws.com/GaleMap1/LR018854test/", { 
                type: 'png',
                getURL: overlay_getTileURL_LR018854,
                alpha: false,
                isBaseLayer: false
        });

        var tmsoverlayLR09149 = new OpenLayers.Layer.TMS("HiRISE ESP09149",
            "https://s3.amazonaws.com/GaleMap1/hirise09149b/", {
                type: 'png',
                getURL: overlay_getTileURL_LR09149,
                alpha: false,
                isBaseLayer: false
        });

        var tmsoverlayLR09650 = new OpenLayers.Layer.TMS("HiRISE ESP09650",
            "https://s3.amazonaws.com/GaleMap1/hirise09650i/", {
                type: 'png',
                getURL: overlay_getTileURL_LR09650,
                alpha: false,
                isBaseLayer: false
        });
    }

    var osm = new OpenLayers.Layer.OSM();
    var baseLayer = new OpenLayers.Layer("Blank",{isBaseLayer: true});

    var size = new OpenLayers.Size(24,30);
    var offset = new OpenLayers.Pixel(-(size.w)-1, -size.h/2);


    var roverLocation = new OpenLayers.LonLat(roverLongitude,
        roverLatitude).transform(map.displayProjection, map.projection);
    roverMarker = new OpenLayers.Marker(roverLocation, mslicon);
    markers.addMarker(roverMarker);
    
    map.addLayers([
        baseLayer,
        nasaMapOverlay
    ]); 

    if (useHighRes) {
        map.addLayers([
            ctx,
            tmsoverlayLR09149,
            tmsoverlayLR018854,
            tmsoverlayLR09650,
            tmsoverlay
        ]);
    }

    map.addLayers([markers]);

    if (useHighRes) { 
        map.zoomToExtent( mapBoundsBASE.transform(map.displayProjection, map.projection ) );
        map.zoomToExtent( mapBoundsLR018854.transform(map.displayProjection, map.projection ) );
        map.zoomToExtent( mapBoundsLR09149.transform(map.displayProjection, map.projection ) );
        map.zoomToExtent( mapBoundsLR09650.transform(map.displayProjection, map.projection ) );
        map.zoomToExtent( mapBounds_ctx.transform(map.displayProjection, map.projection ) );
    }

    OpenLayers.Util.onImageLoadError = function () {
        this.src = "notile.png";
    }

    var lonlat = roverLocation;

    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
    var proj900913 = new OpenLayers.Projection("EPSG:900913");

    map.setCenter(lonlat,startZoom);

    map.isValidZoomLevel = function(zoomLevel) {
        return ((zoomLevel != null) && (zoomLevel >= minZoom) && (zoomLevel <= maxZoom));
    }
}

function moveMarker(sol) {
    if (sol < 0 || sol >= locations.length) {
        console.log("Sol out of bounds!");
    } else {
        markers.removeMarker(roverMarker);
        var lon = locations[sol].longitude;
        var lat = locations[sol].latitude;
        var roverLoc = new OpenLayers.LonLat(lon, lat).transform(map.displayProjection, map.projection)
        roverMarker = new OpenLayers.Marker(roverLoc, mslicon);
        map.setCenter(roverLoc, map.getZoom());
        markers.addMarker(roverMarker);
        markers.redraw();
    }	
}

function drawPath(input_locations) {
    locations = input_locations;
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
        fill: true,
        fillColor: "black",
        fillOpacity: 1.0,
        strokeDashstyle: "solid",
        strokeOpacity: 0.6,
        strokeColor: "#3333ff",
        strokeWidth: 3
    }, OpenLayers.Feature.Vector.style["default"]));

    var vector = new OpenLayers.Layer.Vector("Track", {styleMap: styleMap});

    p = new Array();
    for (var i = 0; i < locations.length ; i++) {
        var xyLoc = new OpenLayers.LonLat(locations[i].longitude,
            locations[i].latitude).transform(map.displayProjection, map.projection)
        p[i] = new OpenLayers.Geometry.Point(xyLoc.lon, xyLoc.lat);
    }

    vector.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(p))]);
    vector.display(false);

    map.addLayers([vector]);
}

function ctxTileURL(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    const mapMinZoomCTX = 8;
    const mapMaxZoomCTX = 14;
    
    if (mapBounds_ctx.intersectsBounds( bounds ) &&
            z >= mapMinZoomCTX &&
            z <= mapMaxZoomCTX ) {

        return "https://s3.amazonaws.com/GaleMap1/GaleCTXadj4/" + z + "/" + x + "/" + y + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
} 

function overlay_getTileURL_LR09149(bounds) {

    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    const mapMinZoomHiRISE09149 = 11;
    const mapMaxZoomHiRISE09149 = 18;

    if (mapBoundsLR09149.intersectsBounds( bounds ) &&
        z >= mapMinZoomHiRISE09149 &&
        z <= mapMaxZoomHiRISE09149 ) {

        return this.url + z + "/" + x + "/" + y + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
}

function overlay_getTileURL_LR09650(bounds) {

    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    const mapMinZoomHiRISE09650 = 11;
    const mapMaxZoomHiRISE09650 = 18;

    if (mapBoundsLR09650.intersectsBounds( bounds ) &&
        z >= mapMinZoomHiRISE09650 &&
        z <= mapMaxZoomHiRISE09650 ) {

        return this.url + z + "/" + x + "/" + y + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
}

function overlay_getTileURL(bounds) {

    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    const mapMinZoomHiRISE = 11;
    const mapMaxZoomHiRISE = 18;

    if (mapBoundsBASE.intersectsBounds( bounds ) &&
        z >= mapMinZoomHiRISE &&
        z <= mapMaxZoomHiRISE ) {

        return this.url + z + "/" + x + "/" + y + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
}

function overlay_getNASATileURL(bounds) {

    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var z = this.map.getZoom();
    var y = Math.round(bounds.bottom / (res * this.tileSize.h));
    var max = [0, 0, 1, 3, 7, 15, 31, 63, 127, 255, 511];
    y = max[z] - y;
        
    if (z <= 9 && z >= 1 && y >= 0 && x >= 0) {
        return this.url + z + "/" + y + "/" + x + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
}

function overlay_getTileURL_LR018854(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    const mapMinZoomHiRISE18854 = 13;
    const mapMaxZoomHiRISE18854 = 18;

    if (mapBoundsLR018854.intersectsBounds( bounds ) &&
        z >= mapMinZoomHiRISE18854 &&
        z <= mapMaxZoomHiRISE18854 ) {

        return this.url + z + "/" + x + "/" + y + "." + this.type;
    } else {
        return "http://www.maptiler.org/img/none.png";
    }
}

function getWindowHeight() {
    if (self.innerHeight) return self.innerHeight;
    if (document.documentElement && document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
    if (document.body) return document.body.clientHeight;
        return 0;
}

function getWindowWidth() {
    if (self.innerWidth) return self.innerWidth;
    if (document.documentElement && document.documentElement.clientWidth)
        return document.documentElement.clientWidth;
    if (document.body) return document.body.clientWidth;
        return 0;
}

function resize() {
    var map = document.getElementById("map");
    //var header = document.getElementById("header");
    //var subheader = document.getElementById("subheader");
    map.style.height = (getWindowHeight()-127) + "px";
    map.style.width = (getWindowWidth()-20) + "px";
    //header.style.width = (getWindowWidth()-20) + "px";
    //subheader.style.width = (getWindowWidth()-20) + "px";
    if (map.updateSize) { map.updateSize(); };
}

onresize=function(){ resize(); };
