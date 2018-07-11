/**
 * Gulp Starter Kit 🎉🎉 v2.0.0 🌅 by @Nadia Inc.
 * https://github.com/nadia-inc/nodejs-web "gulp-starter-kit"
 */

'use strict';

var browserSync   = require('browser-sync'),
    del            = require('del'),
    deleteEmpty    = require('delete-empty'),
    gulp           = require('gulp'),
    ignore         = require('gulp-ignore'),
    notify         = require('gulp-notify'),
    plumber        = require('gulp-plumber'),
    watch          = require('gulp-watch'),
    runSequence    = require('run-sequence'),
    vinylPaths     = require('vinyl-paths'),
    babel          = require('gulp-babel'),
    webpackStream  = require('webpack-stream'),
    webpack        = require('webpack');

var dir = {
  src:  './src',
  dist: './dist'
};

var bundleTarget = dir.src +　'/_assets/js/n_utility.js';
var jsBuildName = 'n_utility.js';

/**
 * Build Subtasks
 */
gulp.task('browser-sync', function() {
  return browserSync.init({
    notify: false,
    server: {
      baseDir: dir.dist
    }
  });
});

gulp.task('clean:dist', function() {
  return gulp.src([
    dir.dist + '/**/*.*',
    '!' + dir.dist + '/_assets/css/**/*.*',
    '!' + dir.dist + '/_assets/js/**/*.*',
    '!' + dir.dist + '/_assets/images/**/*.*'
  ])
    .pipe(vinylPaths(del));
});

gulp.task('clean:scripts', function() {
  return gulp.src([dir.dist + '/_assets/js/**/*.*'])
    .pipe(vinylPaths(del));
});

gulp.task('clean:maps', function() {
  return gulp.src([dir.dist + '/**/*.map'])
    .pipe(vinylPaths(del));
});

gulp.task('delete-empty', function() {
  return deleteEmpty.sync(dir.dist);
});

gulp.task('copy:src', function() {
  return gulp.src([
    dir.src + '/**/*.*',
    '!' + dir.src + '/_assets/scss/**/*.scss',
    '!' + dir.src + '/_assets/js/**/*.js',
    '!' + dir.src + '/_assets/images/**/*.*'
  ])
    .pipe(ignore.include({isFile: true}))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('copy', function(cb) {
  runSequence('clean:dist', 'delete-empty', 'copy:src', cb);
});


gulp.task('scripts', ['clean:scripts'], function() {

  const DEBUG = !process.argv.includes('build');

  return gulp.src(bundleTarget)
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(webpackStream(
        {
          entry: ['@babel/polyfill', bundleTarget ],
          output: {
            filename: jsBuildName//出力ファイル名
          },
          plugins: [
            new webpack.optimize.UglifyJsPlugin()
          ],
          devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
          resolve: {
            extensions: ['.js']
          },
          module: {
            loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader' //babelを使うための宣言
              }
            ]
          }
        },webpack
    ))
    .pipe(gulp.dest(dir.dist + '/_assets/js'))
    .pipe(browserSync.reload({stream: true}));
});



gulp.task('watch:scripts', function() {
  return watch([dir.src + '/_assets/js/**/*.js'], function() {
    return gulp.start(['scripts']);
  });
});

gulp.task('watch:src', function() {
  return watch([
    dir.src + '/**/*.*',
    '!' + dir.src + '/_assets/scss/**/*.scss',
    '!' + dir.src + '/_assets/js/**/*.js',
    '!' + dir.src + '/_assets/images/**/*.*'
  ], function() {
    return gulp.start(['copy']);
  });
});

gulp.task('watch', ['watch:scripts', 'watch:src']);

/**
 * Build Tasks
 */
gulp.task('default', function(cb) {
  runSequence('copy', ['scripts'], 'browser-sync', 'watch', cb);
});

gulp.task('build', function(cb) {
  runSequence('copy', ['scripts'], 'clean:maps', cb);
});
