var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');

var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '189954',
  key: '926b899c43b30dd50675',
  secret: '7f002f9357eaccb1dd87',
  encrypted: true
});

pusher.trigger('test_channel', 'my_event', {
  "message": "hello world"
});

gulp.task('browser-sync', function() {
  browserSync({
    // we need to disable clicks and forms for when we test multiple rooms
    server : {},
    middleware : [ historyApiFallback() ],
    ghostMode: false
  });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({stage : 0 })]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
    .on('error', handleErrors)
    .pipe(source(file))
    .pipe(gulp.dest('./build/'))
    // If you also want to uglify it
    // .pipe(buffer())
    // .pipe(uglify())
    // .pipe(rename('app.min.js'))
    // .pipe(gulp.dest('./build'))
    .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

gulp.task('default', ['scripts','browser-sync'], function() {
  return buildScript('main.js', true); // browserify watch for JS changes
});
