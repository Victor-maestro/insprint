var gulp          = require('gulp'),
    browsersync   = require('browser-sync'), 
    autoprefixer  = require('gulp-autoprefixer'),
    cache         = require('gulp-cache'),
    cleancss      = require('gulp-clean-css'),
    concat        = require('gulp-concat'),
    imagemin      = require('gulp-imagemin'),
    imgCompress   = require('imagemin-jpeg-recompress'),
    imgPngquant   = require('imagemin-pngquant'),
    notify        = require("gulp-notify"),
    rename        = require('gulp-rename'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    uglify        = require('gulp-uglify-es').default,
    svgSprite     = require('gulp-svg-sprite'),
    svgmin        = require('gulp-svgmin'),
    webp          = require('gulp-webp'),
    del           = require('del');
		

// Scripts concat & minify

gulp.task('scripts', function() {
	return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/jquery.maskedinput-master/dist/jquery.maskedinput.min.js',
        'app/libs/svgxuse-master/svgxuse.min.js',
        'app/libs/bootstrap/js/bootstrap.min.js',
        'app/libs/swiper/swiper.min.js',
      ])
      .pipe(concat('vendor.min.js')) // Конкатенация js
      //.pipe(uglify()) // Минимизация js (опц.)
      .pipe(gulp.dest('app/js'))
});


gulp.task('mainjs', function() {
	return gulp.src([
        'app/js/main.js',
      ])
      //.pipe(uglify()) // Минимизация js (опц.)
      .pipe(browsersync.reload( {stream: true} ))
});


gulp.task('css', function() {
	return gulp.src([
        'app/libs/bootstrap/css/bootstrap.min.css',
        'app/libs/swiper/swiper.min.css',
      ])
      .pipe(concat('vendor.min.css')) // Конкатенация css
      .pipe(gulp.dest('app/css'))
      .pipe(browsersync.reload({ stream: true }))
});

gulp.task('html', function() {
	return gulp.src('app/*.html')
      .pipe(browsersync.reload({ stream: true }))
});

gulp.task('browser-sync', function() {
	browsersync({
		server: {
			baseDir: 'app'
		},
		notify: false,
        // open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
    // .pipe(rename({ suffix: '.min', prefix : '' })) // Mifify css (opt.)
	.pipe(autoprefixer(['last 15 versions']))
    // .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} )) // --???
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch('app/js/main.js', gulp.parallel('mainjs'));
	gulp.watch('app/*.html', gulp.parallel('html'))
});

gulp.task('removedist', async function() { return del.sync('dist'); });

// Image minificator
gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(imagemin([
        imgCompress({
            progressive: true,
            min: 70,
            max: 75
        }),
        imgPngquant({quality: [0.7, 0.75]})
    ]))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('assemble', async function() {

	var buildFiles = gulp.src([
		'app/*.html',
        'app/*.php',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/*.css',
        'app/css/*.css.map',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/*.js',
		'app/js/*.js.map',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('clear', function (callback) {
    return cache.clearAll();
})

// SVG-sprite
gulp.task('svgSprite', function () {
    return gulp.src('app/SVG-for-sprite/*.svg') // SVG файлы для спрайта
        .pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
        .pipe(svgSprite({
                mode: {
                    symbol: {        
                        sprite: "../sprite.svg"  // Имя файла SVG-спрайта
                    }
                },
            }
        ))
        .pipe(gulp.dest('app/img/'));
});

// Convert images to WEBP format
gulp.task('webp', () =>
    gulp.src([
        'app/img/**/*.png',
        'app/img/**/*.jpeg',
        'app/img/**/*.jpg',
        ])
        .pipe(webp())
        .pipe(gulp.dest('app/img/webp'))
);


gulp.task('default', gulp.parallel('watch', 'sass', 'scripts', 'mainjs', 'css', 'html', 'browser-sync'));
gulp.task('build', gulp.parallel('assemble', 'removedist', 'scripts', 'mainjs', 'sass', 'css', 'html', 'imagemin'));