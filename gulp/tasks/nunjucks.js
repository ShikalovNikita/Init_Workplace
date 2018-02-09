var gulp           = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var plumber        = require('gulp-plumber');
var gulpif         = require('gulp-if');
var changed        = require('gulp-changed');
var prettify       = require('gulp-prettify');
var frontMatter    = require('gulp-front-matter');
var config         = require('../config');

function renderHTML(onlyChanged) {
	nunjucksRender.nunjucks.configure({
		watch: false,
		trimBlocks: true,
		lstripBlocks: false
	});
	return gulp
		.src([config.src.templates + '/**/[^_]*.html'])
		.pipe(plumber({
			errorHandler: config.errorHandler
		}))
		.pipe(gulpif(onlyChanged, changed(config.dest.html)))
		.pipe(frontMatter({property: 'data'}))
		.pipe(nunjucksRender({
			PRODUCTION: config.production,
			path: [config.src.templates]
		}))
		.pipe(prettify({
			indent_size: 2,
			wrap_attributes: 'auto', // force
			preserve_newlines: false,
			// unformatted: [],
			end_with_newline: true
		}))
		.pipe(gulp.dest(config.dest.html));
}

gulp.task('nunjucks', function() {
	return renderHTML();
});
gulp.task('nunjucks:changed', function(){
	return renderHTML(true);
});
gulp.task('nunjucks:watch', function() {
	gulp.watch([
		config.src.templates + '/**/[^_]*.html'
	],['nunjucks']);

	gulp.watch([
		config.src.templates + '/**/_*.html'
	],['nunjucks']);
});