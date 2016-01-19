const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const gls = require('gulp-live-server');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('dist/app'));
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js',
      'assets/js/**/*.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', '200.md', '!app/**/*.ts', '!app/**/*.styl'], { base : './' })
    .pipe(gulp.dest('dist'))
});

// combines normalize, site, and angular stylesheets to a single minified css file
gulp.task('stylus', ['clean'], function () {
  return gulp.src(['app/app.styl', 'app/**/*.styl'])
    .pipe(concat('app.min.styl'))
    .pipe(stylus({ compress: true, 'include css': true }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', ['compile', 'copy:libs', 'copy:assets'], function() {
  gulp.watch('app/**/*.ts', ['build']);
  gulp.watch('app/**/*.html', ['build']);
  gulp.watch('app/**/*.styl', ['stylus']);
});

gulp.task('serve', ['watch'], function() {
  //1. serve with default settings 
  var server = gls.new('app.js');
  server.start();
 
  //use gulp.watch to trigger server actions(notify, start or stop) 
  gulp.watch(['dist/**/*.html', 'dist/**/*.js', 'dist/**/*.css'], function (file) {
    //console.log('notify apply server');
    server.notify.apply(server, [file]);
  });
});

gulp.task('build', ['compile', 'copy:libs', 'copy:assets', 'stylus']);
gulp.task('default', ['build', 'watch', 'serve']);