const { src, dest, parallel, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser  = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
  html: {
    source: 'source/*.html',
    build: 'build'
  },
  styles: {
    source: 'source/sass/style.scss',
    build: 'build/css'
  },
  scripts: {
    source: 'source/js/*.js',
    build: 'build/js'
  }
};

const html = () => {
  return src(paths.html.source)
      .pipe(htmlmin({
          removeComments: true,
          collapseWhitespace: true,
      }))
      .pipe(dest(paths.html.build))
      .pipe(browserSync.stream())
};

const styles = () => {
  return src(paths.styles.source)
    .pipe(sass())
    .pipe(postcss([
      require('postcss-media-minmax'),
      require('autoprefixer'),
    ]))
    .pipe(cleancss({
      level: 2
    }))
    .pipe(rename('style.min.css'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
};

const scripts = () => {
  return src(paths.scripts.source)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('script.min.js'))
    .pipe(terser())
    .pipe(dest(paths.scripts.build))
    .pipe(browserSync.stream())
};

const clean = () => {
  return del('build')
};

const server = () => {
  browserSync.init({
    server: { baseDir: 'build' },
    notify: false,
    online: true,
    open: false,
    cors: true,
  })
};

const startwatch = () => {
  watch('source/**/*.html', html);
  watch('source/sass/**/*.{scss,sass}', styles);
  watch('source/js/**/*.js', scripts);
};

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.server = server;
exports.default = parallel(html, styles, scripts, server, startwatch);
