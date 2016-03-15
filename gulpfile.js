'use strict';

var autoprefixer = require('autoprefixer'),
    gulp         = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    plumber      = require('gulp-plumber'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    svgstore     = require('gulp-svgstore'),
    gutil        = require('gulp-util'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    calc         = require('postcss-calc'),
    postcssSVG   = require('postcss-svg'),
    cssImport    = require('postcss-import'),
    flexBugs     = require('postcss-flexbugs-fixes'),
    precss       = require('precss'),
    ftp          = require('vinyl-ftp'),
    rimraf       = require('rimraf'),
    seq          = require('run-sequence'),
    R            = require('ramda'),
    connect      = require('gulp-connect'),
    livereload   = require('gulp-livereload');


/* ==========================================================================
   Variables
   ========================================================================== */

var paths = {
  jade: 'src/**/*.jade',
  jadePages: 'src/*.jade',
  css: 'src/css/**/*.css',
  fonts: 'src/fonts/*',
  js: 'src/js/**/*.js',
  jsLibraries: 'src/js/libraries/*.js',
  jsComponents: 'src/js/components/*.js',
  jsOther: 'src/js/*.js',
  img: 'src/img/*',
  spriteSvg: 'src/sprite-svg/*.svg',
  temp: 'src/temp/**/*'
};

var postcssProcessors = [
  cssImport({ glob: true }),
  precss(),
  calc(),
  postcssSVG({ paths: ['src/sprite-css'], svgo: true }),
  flexBugs(),
  autoprefixer({ browsers: ['> 0.1%'] })
];

var onError = function(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};


/* ==========================================================================
   Tasks
   ========================================================================== */

gulp.task('default', function(cb) {
  seq('watch', 'connect', cb);
});

gulp.task('build', function(cb) {
  seq('clean',['html', 'css', 'fonts', 'js', 'img', 'sprite-svg', 'temp'], cb);
});

gulp.task('watch', ['build'], function() {
  gulp.watch( paths.jade,      function() { seq('html');       });
  gulp.watch( paths.css,       function() { seq('css');        });
  gulp.watch( paths.fonts,     function() { seq('fonts');      });
  gulp.watch( paths.js,        function() { seq('js');         });
  gulp.watch( paths.img,       function() { seq('img');        });
  gulp.watch( paths.spriteSvg, function() { seq('sprite-svg'); });
  gulp.watch( paths.temp,      function() { seq('temp');       });
});

gulp.task('clean', function(cb) {
  rimraf('dist', cb);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('html', function() {
  return gulp.src( paths.jadePages )
    .pipe( plumber({ errorHandler: onError }))
    .pipe( jade({
      pretty: true,
      locals: { R: R }
    }) )
    .pipe( gulp.dest('dist') )
    .pipe(connect.reload());
});

gulp.task('css', function() {
  return gulp.src('src/css/base.css')
    .pipe( plumber({ errorHandler: onError }))
    .pipe( sourcemaps.init() )
    .pipe( postcss(postcssProcessors) )
    .pipe( rename('style.css'))
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('dist/resources/css') )
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
  return gulp.src( paths.fonts )
    .pipe( gulp.dest('dist/resources/fonts') )
    .pipe(connect.reload());
});

gulp.task('js-libraries', function() {
  return gulp.src( paths.jsLibraries )
    .pipe( concat('libraries.js') )
    .pipe( uglify() )
    .pipe( gulp.dest('dist/resources/js') )
    .pipe(connect.reload());
});

gulp.task('js-components', function() {
  return gulp.src( paths.jsComponents )
    .pipe( concat('main.js') )
    .pipe( gulp.dest('dist/resources/js') )
    .pipe(connect.reload());
});

gulp.task('js-other', function() {
  return gulp.src( paths.jsOther )
    .pipe( gulp.dest('dist/resources/js') )
    .pipe(connect.reload());
});

gulp.task('js', function(cb) {
  seq(['js-libraries', 'js-components', 'js-other'], cb);
});

gulp.task('img', function () {
  return gulp.src( paths.img )
    .pipe( imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe( gulp.dest('dist/resources/img') )
    .pipe(connect.reload());
});

gulp.task('sprite-svg', function() {
  return gulp.src( paths.spriteSvg )
    .pipe( svgstore() )
    .pipe( imagemin({ multipass: true }))
    .pipe( rename('sprite.svg'))
    .pipe( gulp.dest('dist/resources/img') )
    .pipe(connect.reload());
});

gulp.task('temp', function() {
  return gulp.src( paths.temp )
    .pipe( gulp.dest('dist/temp') )
    .pipe(connect.reload());
});