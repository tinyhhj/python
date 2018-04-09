var gulp = require('gulp')
var gulpBrowser = require('gulp-browser')
var reactify = require('reactify')
var del = require('del')
var size = require('gulp-size')


gulp.task('default',function() {
	console.log('hello!');
});

gulp.task('transform' , function() {
	var stream = gulp.src('./com/accountbook/static/jsx/*.js')
					.pipe(gulpBrowser.browserify({transform: ['reactify']}))
					.pipe(gulp.dest('./com/accountbook/static/js/'))
					.pipe(size());
	return stream;

});
