'use strict';

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
    plumber = require('gulp-plumber'),
	stylus = require('gulp-stylus'),
	svgSprite = require('gulp-svg-sprite'),
	sequence = require('run-sequence');;

var paths = {
	styles: 'Styles/',
	css: 'Styles/',
	svg: 'Styles/images/'
};

var configSvg = {
    mode: {
        css: {
            'dest': './',
            'spacing': {
                'padding': 5
            },
            'sprite': 'sprite/sprite.svg',
            'bust': false,
            'render': {
                'styl': {
                    'template': paths.css + 'sprite-template'
                }
            }
        }
    },
    "variables": {}
};

var buildCommands = [
	['styles', 'svg-sprites'],
];

//Форматирование и построение стилей, добавление префиксов

gulp.task('styles', function() {
    return gulp.src(paths.styles + '*.styl')
        .pipe(plumber())
		.pipe(stylus())
		.pipe($.autoprefixer(['last 2 versions', 'Explorer > 8']))
		.pipe(gulp.dest(paths.css));
});

//Построение спрайта

gulp.task('svg-sprites', function () {
    return gulp.src(paths.svg + '*.svg')
        .pipe(plumber())
        .pipe(svgSprite(configSvg))
        .pipe(gulp.dest(paths.styles));
});

gulp.task('build', function() {
	return sequence.apply(this, buildCommands);
});

gulp.task('watch', function() {
	gulp.watch([paths.svg + '*.svg'], {debounceDelay: 2000}, ['svg-sprites']);

	gulp.watch(paths.styles + '*.styl', ['styles']);
});

//Задача по-умолчанию

gulp.task('default', function() {
	return sequence.apply(this, buildCommands.concat([
		'watch'
	]));
});