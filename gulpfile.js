const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const svgSprite = require('gulp-svg-sprite')
const image = require('gulp-imagemin')
const babel = require('gulp-babel')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()

const styles = () => {
    return src('grid_scss-project/css/**/*.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const htmlMinify = () => {
    return src('grid_scss-project/**/*.html')
    .pipe(htmlMin({
        collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('grid_scss-project/img/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
}

const scripts = () => {
    return src([
        'grid_scss-project/js/**/*.js'
    ])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    // .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src([
        'grid_scss-project/img/**/*.jpg',
        'grid_scss-project/img/**/*.png',
        'grid_scss-project/img/*.svg',
        'grid_scss-project/img/**/*.jpg',
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

watch('Grid_scss-Project/**/*.html', htmlMinify)
watch('Grid_scss-Project/css/((/*.css', styles)
watch('grid_scss-project/img/**/*.svg', svgSprites)
watch('Grid_scss-Project/js/**/*.js', scripts)

exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.default = series(htmlMinify, scripts, styles, images, svgSprites, watchFiles)