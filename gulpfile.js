var gulp = require('gulp');

// plugins
var connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload');

gulp.task('clean', function() {
    del(['./dist/**', './app/js/bundle.js'])
})

gulp.task('js', function() {
    gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('css', function() {
    gulp.src(['./app/**/*.css', '!.app/bower_components/**'])
        .pipe(gulp.dest('./dist/'))
})

gulp.task('bower_components', function() {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
})

gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', function() {
    gulp.src(['app/js/app.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./app/js'))
});

gulp.task('watch', function() {
    gulp.watch('./app/**/*.js', ['browserify'])
})

gulp.task('server', function() {
    connect.server({
        root: 'app/',
        port: 3000
    })
})

gulp.task('serverDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('build', ['css', 'html', 'js', 'bower_components', 'browserify'])
