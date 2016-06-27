var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var gulp = require('gulp');
var if_ = require('gulp-if');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var util = require('gulp-util');


var src = 'assets';
var dest = 'www/dist';
var bower = 'bower_components';

var myPlumber = function() {
    return plumber({
        errorHandler: function(error) {
            util.log(util.colors.red('Unhandled error:\n'), error.toString());
            return this.emit('end');
        }
    });
};

gulp.task('clean:css', function() {
    return del(dest + "/css");
});

gulp.task('css', ['clean:css'], function() {
    var options;
    options = {
        includePaths: [src + "/scss", "" + bower],
        outputStyle: 'compressed',
        sourceMap: true
    };
    return gulp.src(src + "/scss/*.scss")
               .pipe(sourcemaps.init())
               .pipe(sass(options).on('error', sass.logError))
               .pipe(myPlumber())
               .pipe(autoprefixer())
               .pipe(sourcemaps.write('.'))
               .pipe(gulp.dest(dest + "/css"));
});

gulp.task('clean:js', function() {
    return del(dest + "/js");
});

gulp.task('js', ['clean:js'], function() {
    return gulp.src([src + "/js/app.js"], {
        base: '.'
    }).pipe(myPlumber())
      .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dest + "/js"));
});

gulp.task('build', ['css', 'js']);

gulp.task('watch', function() {
    gulp.watch(src + "/scss/**", ['css']);
    return gulp.watch(src + "/js/**", ['js']);
});

gulp.task('default', function(cb) {
    return runSequence('build', 'watch', cb);
});
