var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('clean', function (cb) {
    gulp.src('build', { allowEmpty: true }).pipe(clean())
    cb()
});

gulp.task('chrome', function (cb) {
    gulp.src('src/*.js').pipe(gulp.dest('build/chrome/'));
    gulp.src('images/*.png', {encoding: false}).pipe(gulp.dest('build/chrome/images/'));
    gulp.src('vendor/chrome/*').pipe(gulp.dest('build/chrome/'));
    cb()
})

gulp.task('firefox', function (cb) {
    gulp.src('src/*.js').pipe(gulp.dest('build/firefox/'));
    gulp.src('images/*.png', { encoding: false }).pipe(gulp.dest('build/firefox/images/'));
    gulp.src('vendor/firefox/*').pipe(gulp.dest('build/firefox/'));
    cb()
})