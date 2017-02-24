var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var del = require('del');
var path = require('path');
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//sass tasks
//parse and concat scss files
//depending on the flag passed they will be moved to dev or prod folder
gulp.task('sass', function(){
	gulp.src('app/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('default.css'))
		.pipe(gulp.dest(args.production ? 'prod/assets/css' : 'dev/assets/css'))
		.pipe(livereload());
})

//watch for changes in the sass folder and run 'sass' task

gulp.task('watch:sass', ['sass'], function(){
	livereload.listen();
	gulp.watch('app/sass/**/*.scss', ['sass'])
});

//js tasks
//concat js files, make sure that app.js is first
//depending on the flag passed they will be moved to dev or prod folder
gulp.task('js', function(){
	gulp.src(['app/js/app.js', 'app/js/**/*.js'])
		.pipe(concat('scripts.js'))
		.pipe(gulpif(args.production, uglify()))
		.pipe(gulpif(args.production, rename({suffix : '.min'})))
		.pipe(gulp.dest(args.production ? 'prod/assets/js' : 'dev/assets/js'))
		.pipe(livereload());
})

//watch for changes in js folder and run 'js' task
gulp.task('watch:js', ['js'], function() {
	livereload.listen();
	gulp.watch('app/js/**/*.js', ['js'])
});

//partials tasks
//moves html partials to the dev or prod folder
gulp.task('partials', function(){
	return gulp.src('app/partials/**/*.html')
	.pipe(gulp.dest(args.production ? 'prod/partials' : 'dev/partials'))
	.pipe(livereload());
})

//watch for changes or removal of files in partials folder and run 'partials' task
gulp.task('watch:partials', ['partials'], function(){
	livereload.listen();
	var watcher = gulp.watch('app/partials/**/*.html', ['partials']);
	watcher.on('change', function(event){
		console.log('event.path ' + event.path);
		if(event.type === 'deleted') {
			console.log('event.path ' + event.path);
			var filePathFromSrc = path.relative(path.resolve('app'), event.path);
			var destFilePath = path.resolve(args.production ? 'prod/partials' : 'dev/partials', filePathFromSrc);
			del.sync(destFilePath);
		}
	})
});

// start and restart server on server.js, server-prod.js and gulpfile.js changes, ignore app, dev, prod and node_modules files
gulp.task('server', function(){
	var server = args.production ? 'server-prod.js' : 'server.js';
	nodemon({
		script: server,
		ext: 'js',
		ignore: ['app*', 'dev*', 'prod*', 'node_modules*']
	})
})

//build files and run server
gulp.task('serve', ['watch:sass', 'watch:js', 'watch:partials', 'server']);