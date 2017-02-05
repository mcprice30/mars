System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  map: {

    'app': '{{ static }}',

    '@angular/core': '{{ static }}/node_modules/@angular/core/bundles/core.umd.min.js',
    '@angular/common': '{{ static }}/node_modules/@angular/common/bundles/common.umd.min.js',
    '@angular/compiler': '{{ static }}/node_modules/@angular/compiler/bundles/compiler.umd.min.js',
    '@angular/platform-browser': '{{ static }}/node_modules/@angular/platform-browser/bundles/platform-browser.umd.min.js',
    '@angular/platform-browser-dynamic': '{{ static }}/node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
    '@angular/http': '{{ static }}/node_modules/@angular/http/bundles/http.umd.min.js',
    '@angular/router': '{{ static }}/node_modules/@angular/router/bundles/router.umd.min.js',
    '@angular/forms': '{{ static }}/node_modules/@angular/forms/bundles/forms.umd.min.js',
    '@angular/core/testing': '{{ static }}/node_modules/@angular/core/bundles/core-testing.umd.min.js',
    '@angular/common/testing': '{{ static }}/node_modules/@angular/common/bundles/common-testing.umd.min.js',
    '@angular/compiler/testing': '{{ static }}/node_modules/@angular/compiler/bundles/compiler-testing.umd.min.js',
    '@angular/platform-browser/testing': '{{ static }}/node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.min.js',
    '@angular/platform-browser-dynamic/testing': '{{ static }}/node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.min.js',
    '@angular/http/testing': '{{ static }}/node_modules/@angular/http/bundles/http-testing.umd.min.js',
    '@angular/router/testing': '{{ static }}/node_modules/@angular/router/bundles/router-testing.umd.min.js',
    'requirejs': '{{ static }}/node_modules/requirejs/bin/r.js',

    'rxjs': '{{ static }}/node_modules/rxjs',
    'typescript': '{{ static }}/node_modules/typescript/lib/typescript.js',

    "angular2-masonry": "{{ static }}/node_modules/angular2-masonry",
    "masonry-layout": "{{ static }}/node_modules/masonry-layout/dist/masonry.pkgd.js",

    "marsmap.js": "{{ static }}/marsmap.js",
    "OpenLayers.js": "{{ static }}/OpenLayers.js"
  },
  packages: {
    app: {
      main: 'main.ts',
      defaultExtension: 'ts'
    },
    '@angular/core': {
      defaultExtension: 'js'
    },
    '@angular/common': {
      defaultExtension: 'js'
    },
    '@angular/compiler': {
      defaultExtension: 'js'
    },
    '@angular/platform-browser': {
      defaultExtension: 'js'
    },
    '@angular/platform-browser-dynamic': {
      defaultExtension: 'js'
    },
    '@angular/http': {
      defaultExtension: 'js'
    },
    '@angular/router': {
      defaultExtension: 'js'
    },
    '@angular/forms': {
      defaultExtension: 'js'
    },
    '@angular/core/testing': {
      defaultExtension: 'js'
    },
    '@angular/common/testing': {
      defaultExtension: 'js'
    },
    '@angular/compiler/testing': {
      defaultExtension: 'js'
    },
    '@angular/platform-browser/testing': {
      defaultExtension: 'js'
    },
    '@angular/platform-browser-dynamic/testing': {
      defaultExtension: 'js'
    },
    '@angular/http/testing': {
      defaultExtension: 'js'
    },
    '@angular/router/testing': {
      defaultExtension: 'js'
    },
    typescript: {
      defaultExtension: 'js'
    },
    rxjs: {
      defaultExtension: 'js'
    },
    'requirejs': {
      defaultExtension: 'js'
    },
    "angular2-masonry": { 
      defaultExtension: "js",
      main: "index"
    },
    'masonry-layout': {
      defaultExtension: "js"
    },
    'marsmap.js': {
      defaultExtension: "js"
    },
    'OpenLayers.js': {
      defaultExtension: "js"
    }
  }
});
