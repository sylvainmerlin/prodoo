'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license']
});


gulp.task('htmldev', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('**/*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    // .pipe($.ngAnnotate())
    // .pipe($.uglify({mangle:false}).on('error', function(e){
    //   console.log(e);
    // }))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../assets/libs/bootstrap-sass-official_3.3.7/fonts/bootstrap/', '../fonts/'))
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(paths.build + '/'))
    .pipe($.size({ title: paths.build + '/', showFiles: true }));
});

gulp.task('imagesdev', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.build + '/assets/images/'));
});

gulp.task('fontsdev', function () {
  return gulp.src(paths.src + '/assets/libs/bootstrap-sass-official_3.3.3/fonts/*')
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.build + '/fonts/'));
});

gulp.task('miscdev', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.build + '/'));
});

gulp.task('cleandev', function () {
  $.del([paths.build + '/', paths.tmp + '/'], {force:true});
});

gulp.task('debug', ['htmldev', 'imagesdev', 'fontsdev', 'miscdev']);
