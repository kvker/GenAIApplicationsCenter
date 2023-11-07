const { src, parallel, dest, watch } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

// const dev_url = 'src/'
// src = path => src(dev_url + path)

function htmls() {
  return src('src/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
      })
    )
    .pipe(dest('dist/'))
}

function styles() {
  return src('src/styles/**/*.css')
    .pipe(cleanCss())
    // .pipe(
    //   rename(function (path) {
    //     if(path.basename.includes('.min')) {
    //       return
    //     }
    //     // Returns a completely new object, make sure you return all keys needed!
    //     return {
    //       dirname: path.dirname,
    //       basename: path.basename,
    //       extname: '.min.css',
    //     }
    //   })
    // )
    .pipe(dest('dist/styles/'))
}

function scripts() {
  return src('src/scripts/**/*.js').pipe(uglify()).pipe(dest('dist/scripts/'))
}

function libs() {
  return src('src/libs/**/*').pipe(dest('dist/libs/'))
}

function icons() {
  return src('src/icons/**/*').pipe(dest('dist/icons/'))
}

function images() {
  return src('src/images/**/*').pipe(dest('dist/images/'))
}

function docs() {
  return src('src/docs/**/*').pipe(dest('dist/docs/'))
}

function files() {
  return src(['src/app.webmanifest', 'src/robots.txt', 'src/favicon.ico']).pipe(dest('dist/'))
}

exports.default = parallel(htmls, styles, scripts, libs, icons, images, docs, files)

// watch(['src/*', 'gulpfile.js'], parallel(htmls, styles, scripts))