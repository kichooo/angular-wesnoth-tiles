var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  serve = require('gulp-serve'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  copy = require('gulp-copy'),
  merge = require('merge2'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace'),
  mainBowerFiles = require('main-bower-files'),
  gulpFilter = require('gulp-filter'),
  util = require('gulp-util'),
  tsd = require('gulp-tsd');
typescript = require('typescript')


gulp.task('lib', function() {
  var jsFilter = gulpFilter("*.js");

  var files = mainBowerFiles({
    includeDev: "inclusive"
  });

  return gulp.src(files)
    .pipe(jsFilter)
    .pipe(concat("lib.js"))
    .pipe(gulp.dest("."));
});

gulp.task('scripts', ['lib'], function() {
  var tsStreams = gulp.src(['angular-wesnoth-tiles.ts'])
    .pipe(ts({
      // noImplicitAny: true,
      declarationFiles: true,
      target: "ES6",
      out: 'angular-wesnoth-tiles.js',
      typescript: typescript
    }));

  var jsStream = tsStreams.js
    .pipe(gulp.dest("."))
    .pipe(notify({
      "message": "Typescript built succesfully.",
      "onLast": true,
      "time": 3000
    }));

  var defStream = tsStreams.dts
    .pipe(gulp.dest("."));

  return merge([jsStream, defStream])
    .on("error", notify.onError(function(error) {
      return "Failed to build typescript: " + error.message;
    }));
});

gulp.task('install', function(callback) {
  tsd({
    "command": "reinstall", // this plugin supports only "reinstall"
    "latest": true, // if this property is true, tsd always fetches HEAD definitions
    "config": "./tsd.json", // file path for configuration file (see below)
    "opts": {
      // options, EXPERIMENTAL
    }
  }, callback);
});

gulp.task('app', ['scripts'], function() {
  var streams = gulp.src('test/src/testApp.ts')
    .pipe(ts({
      declarationFiles: false,
      target: "ES6",
      out: 'testApp.js',
      typescript: typescript
    }));

  var jsStream = streams.js
    .pipe(gulp.dest("test/bin"));
  return jsStream;
});

gulp.task('watch', ['app'], function() {
  gulp.watch(['test/src/testApp.ts', 'angular-wesnoth-tiles.ts'], ['app']);
});

gulp.task('serve', serve({
  root: ['test', '.'],
  port: 8002,
}));

gulp.task("default", ["app"]);