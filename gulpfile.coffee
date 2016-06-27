autoprefixer = require('gulp-autoprefixer')
coffee       = require('gulp-coffee')
concat       = require('gulp-concat')
del          = require('del')
gulp         = require('gulp')
if_          = require('gulp-if')
merge        = require('merge-stream')
plumber      = require('gulp-plumber')
rename       = require('gulp-rename')
runSequence  = require('run-sequence')
sass         = require('gulp-sass')
sourcemaps   = require('gulp-sourcemaps')
uglify       = require('gulp-uglify')
util         = require('gulp-util')

#===============================================================================
# Settings
#===============================================================================

# Directories
src   = 'assets'
dest  = 'www/dist' # Swap to building into dist folder
bower = 'bower_components'

#===============================================================================
# Helpers
#===============================================================================

# Don't break watch when there's an error in CoffeeScript
# http://blog.ibangspacebar.com/handling-errors-with-gulp-watch-and-gulp-plumber/
myPlumber = -> plumber
    errorHandler: (error) ->
        util.log(util.colors.red('Unhandled error:\n'), error.toString())
        this.emit('end')


#===============================================================================
# CSS
#===============================================================================

gulp.task 'clean:css', ->
    del("#{dest}/css")


gulp.task 'css', ['clean:css'], ->
    options =
        includePaths: [
            "#{src}/scss"
            "#{bower}"
        ],
        outputStyle: 'compressed', # Use 'expanded' for readable output
        sourceMap: true

    gulp.src("#{src}/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass(options).on('error', sass.logError))
        .pipe(myPlumber())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("#{dest}/css"))


#===============================================================================
# JavaScript
#===============================================================================

gulp.task 'clean:js', ->
    del("#{dest}/js")


gulp.task 'js', ['clean:js'], ->

    #----------------------------------------
    # app.js
    #----------------------------------------

    gulp.src([
        # Custom
        "#{src}/js/app.js"
    ], base: '.')
        .pipe(myPlumber())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("#{dest}/js"))

#===============================================================================
# General
#===============================================================================

gulp.task 'build', ['css', 'js']


gulp.task 'watch', ->
    gulp.watch "#{src}/scss/**", ['css']
    gulp.watch "#{src}/js/**", ['js']


gulp.task 'default', (cb) ->
    runSequence('build', 'watch', cb)
