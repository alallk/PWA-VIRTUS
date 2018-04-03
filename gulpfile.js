var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var server = require('gulp-server-livereload');



// Sass Source
var scssFiles = './scss/**/*.scss';
var sassFiles = './scss/**/*.sass';

// CSS destination
var cssDest = './css';

// Options for development
var sassDevOptions = {
    outputStyle: 'expanded'
};

// Options for production
var sassProdOptions = {
    outputStyle: 'compressed'
};

var optFileName = {
    suffix: '.min'
};
//Options live reload
var optLiveReload = {
    livereload: true,
    directoryListing: true,
    open: true
};

/*
 * Tasks
 */

gulp.task('sassdevscss', function() {
    return gulp.src(scssFiles)
        .pipe(sass(sassDevOptions).on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});

gulp.task('sassdevsass', function() {
    return gulp.src(sassFiles)
        .pipe(sass(sassDevOptions).on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});

// Task 'sassdev' - Run with command 'gulp sassdev'
gulp.task('sassdev', ['sassdevscss', 'sassdevsass']);


gulp.task('sassprodsass', function() {
    return gulp.src(sassFiles)
        .pipe(sass(sassProdOptions).on('error', sass.logError))
        .pipe(rename(optFileName))
        .pipe(gulp.dest(cssDest));
});

gulp.task('sassprodscss', function() {
    return gulp.src(scssFiles)
        .pipe(sass(sassProdOptions).on('error', sass.logError))
        .pipe(rename(optFileName))
        .pipe(gulp.dest(cssDest));
});

// Task 'sassprod' - Run with command 'gulp sassprod'
gulp.task('sassprod', ['sassprodsass','sassprodscss']);

// Task 'watch' - Run with command 'gulp watch'
gulp.task('watch', function() {
    gulp.watch(scssFiles, ['sassdev', 'sassprod']);
    gulp.watch(sassFiles, ['sassdev', 'sassprod']);
});

// Default task - Run with command 'gulp'
gulp.task('default', [ 'sassprod', 'watch']);

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(server(optLiveReload));
});