const gulp = require('gulp');
const browsersync = require('browser-sync').create();

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}


// Watch files
function watchFiles() {
    gulp.watch("./resources/css/*.css", browserSyncReload);
    gulp.watch("./resources/js/*.js", browserSyncReload);
    gulp.watch("./resources/data/*.json", browserSyncReload);
    gulp.watch("./index.html", browserSyncReload);
    // gulp.watch("./site_assets/images/**/*.{png,jpg,jpeg,svg,gif}", images);
    // gulp.watch("./site_assets/vids/*.{mp4,webm,ogg}", videos);
}


// watch
gulp.task("watch",
    gulp.parallel(watchFiles, browserSync)
);