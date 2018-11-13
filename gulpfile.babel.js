/**
 * @project:  tiagofernandes.me
 * @author:   Tiago de Araujo Fernande - TAF (@Tiago de Araujo Fernande - TAF)
 * Copyright (c) 2018 Tiago de Araujo Fernande - TAF
 * Released under the ISC license
 */

import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import cleanCSS from 'gulp-clean-css';
import gulpLoadPlugins from 'gulp-load-plugins';
import {argv} from 'yargs';
import config from './config.json'
import pkg from './package.json';

const $ = gulpLoadPlugins();
const server = browserSync.create();
const banner = `
/**
 * @project:  ${pkg.name}
 * @author:   ${pkg.author} (@${pkg.author})
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} license
*/
`;

/* List all tasks and subtasks */
gulp.task('help', $.taskListing);


const clean = () => del(['dist']);

const styles = () => {
  return gulp.src(config.sass_src)
    .pipe($.plumber())
    .pipe($.if(argv.pretty, $.sourcemaps.init()))
    .pipe($.sass({
      includePaths: ['node_modules']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(config.autoprefixer_options))
    .pipe(cleanCSS())
    .pipe($.size({title: 'Styles'}))
    .pipe($.header(banner, {pkg}))
    .pipe($.concat(config.css_file_name))
    .pipe($.if(argv.pretty, $.sourcemaps.write('./')))
    .pipe(gulp.dest(config.sass_dest))
};

const scripts = () => {

  let b = browserify({
    entries: './app/js/app.js',
    debug: true,
  }).transform(babelify, {presets: ["es2015"]});

  return b.bundle()
    .pipe(source('./app/js/app.js'))
    .pipe(buffer())

    .pipe($.size({title: 'Bundle scripts'}))
    .pipe($.if(argv.pretty, $.sourcemaps.init()))
    .pipe($.concat(config.js_file_name))
    .pipe($.if(!argv.pretty, $.uglify({})))
    .pipe($.header(banner, {pkg}))
    .pipe($.size({title: 'Scripts'}))
    .pipe(gulp.dest(config.js_dest))

};

const vendor = () => {
  return gulp.src("./app/js/3d.js")
    .pipe($.include({
      extensions: "js",
      hardFail: true,
      includePaths: [
        __dirname + "/node_modules/three"
      ]
    }))
    .pipe($.if(!argv.pretty, $.uglify({})))
    .pipe($.header(banner, {pkg}))
    .pipe($.size({title: 'Vendor'}))
    .pipe($.concat(config.js_file_name_vendor))
    .pipe(gulp.dest(config.js_dest));
};



const views = () => {
  return gulp.src(config.templates_src)
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.templates_dest))
};


const fonts = () => {
  return gulp.src(config.fonts_src)
    .pipe(gulp.dest(config.fonts_dest));
};

const images = () => {
  return gulp.src(config.img_src)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.img_dest))
};

/*Copy the content from src/ to dist*/
gulp.task('copy', gulp.parallel(clean), () => gulp.parallel(clean)
  .pipe($.plumber())
  .pipe($.size({title: 'Copying ./src content in ./dist'}))
  .pipe(gulp.dest(config.dist_folder)));

const reload = (done) => {
  server.reload();
  done();
};

const serve = gulp.series(clean, styles, scripts, vendor, views, fonts, images, (done) => {
  const startTime = Date.now();
  console.log('\x1b[42m************************************\x1b[0m\n');
  console.log('\x1b[32m  Project ready for coding 😎\x1b[0m\n');
  console.log('\x1b[42m************************************\x1b[0m\n');
  console.log('[\x1b[32m\x1b[0m]', `All finished in \x1b[35m${Date.now() - startTime} ms`, '\x1b[0m\n');
  server.init({
    notify: config.notify,
    server: {
      baseDir: "./dist",
    },
    port: config.port,

  });
  /*gulp.watch(['./app/!**!/!*.pug'], gulp.series(views), reload);*/
  gulp.watch(['./app/templates/**/*.pug'], gulp.series(views), reload);
  gulp.watch(['./app/**/*.html']).on('change', reload);
  gulp.watch(['./app/css/**/*.scss'], gulp.series(styles), reload);
  gulp.watch(['./app/js/*.js'], gulp.series(scripts, vendor), reload);
  gulp.watch(['./app/img/!**!/!*'], reload);

  done();
});


gulp.task('production', gulp.series(clean, styles, scripts, vendor, views, fonts, images), () => {
  gulp.series('copy')
});

const dev = gulp.series(clean, serve, () => {
  const startTime = Date.now();
  console.log('[\x1b[32m\x1b[0m]', `All finished in \x1b[35m${Date.now() - startTime} ms`, '\x1b[0m\n');
});

export default dev;

