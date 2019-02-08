//-Require packages
var gulp = require('gulp'),
runSequence = require('run-sequence'),
sass = require('gulp-sass'),
jade = require('gulp-jade'),
watch = require('gulp-watch'),
prefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
rigger = require('gulp-rigger'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
cssmin = require('gulp-minify-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
rimraf = require('rimraf'),
plumber = require('gulp-plumber'),    
browserSync = require('browser-sync'),
reload = browserSync.reload;



//-All src 'n build
var path = {
    build: { // Where to upload build files after compilation
        html: './build/html/',
        php: './build/',
        js: './build/js/',
        style: './build/css/',
        img: './build/img/',
        fonts: './build/fonts/'
    },
    src: { // Where to get the source
        html: './src/jade/*.jade',
        php: './src/**/*.php',
        js: './src/js/*.+(js|json)',
        style: './src/sass/main.+(sass|scss)',
        img: './src/img/**/*.*', 
        fonts: './src/fonts/**/*.*'
    },
    watch: { // What change files and folders to watch
        html: './src/jade/**/*.jade',
        php: './src/**/*.php',
        js: './src/js/**/*+(js|json)',
        style: './src/sass/**/*.+(sass|scss)',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    ui: {
        port: 8047
    },
    server: {
        baseDir: "./build/",
        index: "./html/index.html"
    },
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
    },
    tunnel: false,
    open: true,
    host: 'localhost',
    port: 8046, 
    logPrefix: "magicline",
    livereload: true
};


//-Compile n' Build
gulp.task('html:build', function() {
    return gulp.src(path.src.html)
    .pipe(jade())
    .pipe(plumber())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
gulp.task('php:build', function() {
    return gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php))
    .pipe(reload({stream: true}));
});
gulp.task('js:build', function() {
    return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});
gulp.task('style:build', function() {
    return gulp.src(path.src.style)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/css/'))    
    .pipe(prefixer(['last 35 versions'], {cascade: true}))
    .pipe(plumber())
    .pipe(gulp.dest(path.build.style))
    .pipe(cssmin())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build.style))
    .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'php:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

// Reload server
gulp.task('webserver', function () {
    return browserSync(config);
});

// Clear
gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});



// We track all changes
gulp.task('allwatch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.php], function(event, cb) {
        gulp.start('php:build');
    });    
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });    
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });

});

gulp.task('watch', function (done) {
    return runSequence('allwatch', 'webserver', done);
});



// Default Task
gulp.task('default', function (callback) {
    return runSequence(['build', 'watch'], callback);
});