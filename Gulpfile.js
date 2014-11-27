'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    rimraf = require('rimraf'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    ngAnnotate = require('browserify-ngannotate'),
    nodemon = require('gulp-nodemon');

// var expressServer = require('./server');
// gulp.task('serve_', function() {
//   console.log('Server');
//   expressServer.startServer();
// });

// gulp.task('serve', function () {
//   nodemon({ script: 'server.js', ext: 'json js', ignore: ['public/*', 'client/*'] })
//   .on('change', ['lint'])
//   .on('restart', function () {
//     console.log('Restarted webserver')
//   });
// });

gulp.task('clean', function (cb) {
    rimraf.sync('./build');
    cb(null);
});

// Dev task
gulp.task('dev', ['views', 'styles', 'lint', 'browserify', 'watch'], function() {});

// JSLint task
gulp.task('lint', function() {
  gulp.src('assets/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Styles task
gulp.task('styles', function() {
  gulp.src('assets/styles/*.css')
  .pipe(gulp.dest('./src/ratpack/public/css/'));
});

// Browserify task
gulp.task('browserify', function() {
  // var bundleStream = browserify({
  //   entries: ['./client/scripts/main.js'],
  //   debug: true
  // }).bundle();

  var bundleStream = browserify({entries: './assets/scripts/main.js', debug: true, fullPaths: true})
                      .transform(ngAnnotate)
                      .bundle();
  bundleStream
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest("./src/ratpack/public/js"));
    //.pipe(source('core.js'));
  //return bundleStream.pipe(gulp.dest('./public/js'));
});

gulp.task("minify", function() {
  gulp.src('./src/ratpack/public/js/core.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('assets/index.html')
  // And put it in the public folder
  .pipe(gulp.dest('./src/ratpack/templates/'));

  // Any other view files from assets/views
  gulp.src('assets/views/**/*')
  // Will be put in the public/views folder
  .pipe(gulp.dest('./src/ratpack/public/views/'));
});

gulp.task('watch', ['lint'], function() {

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['assets/scripts/*.js', 'assets/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);

  // Watch our css files
  gulp.watch(['assets/styles/**/*.css'], [
    'styles'
  ]);

  // Watch view files
  gulp.watch(['assets/**/*.html'], [
    'views'
  ]);

});

gulp.task('default', ['dev']);