const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
let imageResize = require('gulp-image-resize');
const imageminWebp = require('imagemin-webp');
const runSequence = require('run-sequence');
const del = require('del');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const es = require('event-stream');

// const browserify = require('browserify');
//https://github.com/rstoenescu/gulp-pipes
// const pipes = require('gulp-pipes');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
// const uglifyes = require('gulp-uglifyes');
// const less = require('gulp-less');
// const notify = require('gulp-notify');
// const os = require('os');
// const parallel = require('concurrent-transform');
// const image = require('gulp-image');
// const imageoptimize = require('gulp-image-optimization');
// const dest = require('gulp-dest');
// const gutil = require('gulp-util');
// const pump = require('pump');

//https://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp

const paths = {
    assets_root: {
        src: ['manifest.json', 'src/**/*.html'],
        dest: './public'
    },
    // assets_js: {
    //     src: ['node_modules/idb/lib/idb.js'],
    //     dest: './public/js/'
    // },
    placeholder: {
        src: 'src/placeholder/',
        filename: 'placeholder.md'
    },
    icons: {
        src: 'src/images_src/icons/*',
        dest: 'public/img/icons/'
    },
    images_static: {
        src: 'src/images_src/static/*',
        dest: 'public/img/'
    },
    images: {
        src: ['src/images_src/**/*.{jpg,png,tiff}', '!src/images_src/icons/**/*', '!src/images_src/static/**/*'],
        dest: 'public/img/'
    },
    styles: {
        src: 'src/css/**/*.css',
        dest: 'public/css/'
    },
    scripts_sw: {
        src: ['src/sw.js'],
        saveas: 'sw.js',
        dest: 'public/'
    },
    scripts_index: {
        src: ['src/js/**/*.js', '!src/js/restaurant.js'],
        saveas: 'index.min.js',
        dest: 'public/js/'
    },
    scripts_restaurant: {
        src: ['./src/js/**/*.js', '!./src/js/index.js'],
        saveas: 'restaurant.min.js',
        dest: 'public/js/'
    },
    scripts_dbhelper: {
        src: ['src/lib/dbhelper.js'],
        saveas: 'dbhelper.min.js',
        dest: 'public/js/'
    },
    scripts_idb: {
        src: ['node_modules/idb/lib/idb.js'],
        dest: 'public/js/'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean_build() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['public/**/*']);
}

/*
 * Create empty folder structure
 */
function clean_placeholder() {
    // remove placeholder folders

    return es.merge(
        gulp.src([paths.styles.dest + paths.placeholder.filename], {read: false})
            .pipe(clean()),

        gulp.src([paths.scripts_index.dest + paths.placeholder.filename], {read: false})
            .pipe(clean())
    );
}

function copy_assets() {

    return es.merge(
        // create folder structure with placeholders folder
        gulp.src([paths.placeholder.src + paths.placeholder.filename])
            .pipe(gulp.dest(paths.scripts_index.dest)),
        gulp.src([paths.placeholder.src + paths.placeholder.filename])
            .pipe(gulp.dest(paths.styles.dest)),

        gulp.src(paths.assets_root.src)
            .pipe(gulp.dest(paths.assets_root.dest)),

        // gulp.src(paths.assets_js.src)
        //     .pipe(gulp.dest(paths.assets_js.dest)),

        gulp.src(paths.images.src)
            .pipe(gulp.dest(paths.images.dest)),

        gulp.src(paths.icons.src)
            .pipe(gulp.dest(paths.icons.dest)),

        gulp.src(paths.images_static.src)
            .pipe(gulp.dest(paths.images_static.dest)),

        gulp.src(paths.scripts_idb.src, {sourcemaps: false})
                .pipe(babel())
                .pipe(uglify())
                .pipe(gulp.dest(paths.scripts_idb.dest))
    );
}

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
    //.pipe(less())
        .pipe(cleanCSS())
        .pipe(cleanCSS({debug: false}, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        //pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts_index() {

    gulp.src(paths.scripts_index.src, {sourcemaps: false})
        .pipe(babel())
        .pipe(concat(paths.scripts_index.saveas))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts_index.dest));
}

function scripts_restaurant() {

    return gulp.src(paths.scripts_restaurant.src, {sourcemaps: false})
        .pipe(babel())
        .pipe(concat(paths.scripts_restaurant.saveas))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts_restaurant.dest));

}

function scripts_dbhelper() {

    return gulp.src(paths.scripts_dbhelper.src, {sourcemaps: false})
        .pipe(babel())
        .pipe(concat(paths.scripts_dbhelper.saveas))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts_dbhelper.dest));
}

function scripts_sw() {

    return gulp.src(paths.scripts_sw.src, {sourcemaps: false})
        .pipe(babel())
        .pipe(concat(paths.scripts_sw.saveas))
        //.pipe(uglify())
        .pipe(gulp.dest(paths.scripts_sw.dest));
}

function watch() {
    gulp.watch(paths.scripts_sw.src, scripts_sw);
    gulp.watch(paths.scripts_index.src, scripts_index);
    gulp.watch(paths.scripts_restaurant.src, scripts_restaurant);
    gulp.watch(paths.scripts_dbhelper.src, scripts_dbhelper);
    gulp.watch(paths.styles.src, styles);

    return true;
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean_build = clean_build;
// exports.placeholder = placeholder;
exports.clean_placeholder = clean_placeholder;
// exports.copy_html = copy_html;
// exports.copy_manifest = copy_manifest;
exports.copy_assets = copy_assets;
// exports.copy_images = copy_images;
// exports.copy_icons = copy_icons;
// exports.copy_service_worker = copy_service_worker;
exports.styles = styles;
exports.scripts_sw = scripts_sw;
exports.scripts_index = scripts_index;
exports.scripts_restaurant = scripts_restaurant;
exports.scripts_dbhelper = scripts_dbhelper;
exports.watch = watch;


// Create multiple resolution based images
// https://stackoverflow.com/questions/35801807/gulp-image-resize-to-generate-multiple-output-sizes
let resizeImageTasks = [];
//[100, 300, 800, 1000, 2000]
[320, 640, 1024, 1600].forEach(function (size) {
    let resizeImageTask = 'resize_' + size;
    gulp.task(resizeImageTask, function () {
        return gulp.src(paths.images.src)
            .pipe(imageResize({
                width: size,
                height: size,
                upscale: false
            }))
            .pipe(imagemin([
                imageminWebp({
                    quality: 75
                })]))
            .pipe(gulp.dest(paths.images.dest + size + '/'))
        //.pipe(gulp.dest(paths.images.dest))
    });
    resizeImageTasks.push(resizeImageTask);
});
gulp.task('resize_images', resizeImageTasks);

// gulp.task('resize_images_100', function () {
//     const size = 100;
//     return gulp.src(paths.images.src)
//         .pipe(
//             imageResize({
//                 width: size,
//                 height: size,
//                 crop: false,
//                 upscale: false
//         }))
//         .pipe(imagemin([
//             imageminWebp({
//                 quality: 75
//             })]))
//         .pipe(gulp.dest(paths.images.dest + size + '/'))
//         //.pipe(gulp.dest(paths.images.dest))
// });

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
//let build = gulp.series(clean_build, gulp.parallel(styles, scripts));

gulp.task('clean_build', function () {
    return clean_build();
});
// gulp.task('placeholder', function () {
//     return placeholder();
// });
gulp.task('clean_placeholder', function () {
    return clean_placeholder();
});
// gulp.task('copy_html', function () {
//     return copy_html();
// });
gulp.task('copy_assets', function () {
    return copy_assets();
});
// gulp.task('copy_manifest', function () {
//     return copy_manifest();
// });
// gulp.task('copy_images', function () {
//     return copy_images();
// });
// gulp.task('copy_icons', function () {
//     return copy_icons();
// });
// gulp.task('copy_service_worker', function () {
//     return copy_service_worker();
// });
gulp.task('styles', function () {
    return styles();
});
gulp.task('scripts_index', function () {
    return scripts_index();
});
gulp.task('scripts_sw', function () {
    return scripts_sw();
});
gulp.task('scripts_restaurant', function () {
    return scripts_restaurant();
});
gulp.task('scripts_dbhelper', function () {
    return scripts_dbhelper();
});
gulp.task('watch', function () {
    return watch();
});

/*
 * You can still use `gulp.task` to expose tasks
 */
// gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
// gulp.task('default', build);
gulp.task('default', (function () {
    runSequence(
        'clean_build',
        'copy_assets',
        'clean_placeholder',
        ['styles', 'scripts_sw', 'scripts_index', 'scripts_restaurant', 'scripts_dbhelper'],
        'resize_images',
    );
}));
