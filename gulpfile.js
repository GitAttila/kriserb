const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminPngQuant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
// lossy images plugins
const imageminMozjpeg = require('imagemin-mozjpeg');
var del = require('del');
const server = require('browser-sync').create();

var paths = {
    images: {
        src: './resources/img/**/*.{png,jpg,jpeg,svg,gif,pdf}',
        dest: './dist/resources/img'
    },
    styles: {
        src: './resources/css/**/*.css',
        dest: './dist/resources/css'
    },
    scripts: {
        src: './resources/js/**/*.*',
        dest: './dist/resources/js'
    },
    data: {
        src: './resources/data/**/*.*',
        dest: './dist/resources/data'
    },
    vendors: {
        src: './vendors/**/*.*',
        dest: './dist/vendors'
    },
    rootfiles: {
        src: './*.{txt,html,ico,xml,webmanifest}',
        dest: './dist'
    }
};

// BrowserSync
function serve(done) {
    server.init({
        server: {
            baseDir: "./"
        },
        port: 3000,
        notify: false
    });
    done();
}

// BrowserSync Reload
function serverReload(done) {
    server.reload();
    done();
}

function previewDist(done) {
    server.init({
        server: {
            baseDir: './dist'
        },
        notify: false
    });
    done();
}

function clean() {
    return del(['./dist']);
}

function rootfiles() {
    return gulp.src(paths.rootfiles.src)
        .pipe(gulp.dest(paths.rootfiles.dest));
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulp.dest(paths.scripts.dest));
}

function data() {
    return gulp.src(paths.data.src)
        .pipe(gulp.dest(paths.data.dest));
}

function vendors() {
    return gulp.src(paths.vendors.src)
        .pipe(gulp.dest(paths.vendors.dest));
}

function images() {
    return gulp.src([paths.images.src])
        .pipe(imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imageminMozjpeg({quality: 80}),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngQuant(),
                imageminJpegRecompress()
            ], 
            {
                progressive: true,
                interlaced: true,
                multipass: true,
                verbose: true
            }
        ))
        .pipe(gulp.dest(paths.images.dest));
}

// Watch files
function watchFiles() {
    gulp.watch("./resources/css/*.css", gulp.series(serverReload));
    gulp.watch("./resources/js/*.js", gulp.series(serverReload));
    gulp.watch("./resources/data/*.json", gulp.series(serverReload));
    gulp.watch("./index.html", serverReload);
}

var watch = gulp.series(serve, watchFiles);
var preview = gulp.series(previewDist);
var build = gulp.series(clean, gulp.series(styles, scripts, data, vendors, rootfiles), gulp.parallel(images));

exports.watch = watch;
exports.clean = clean;
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.data = data;
exports.preview = preview;
exports.build = build;
exports.default = build;

