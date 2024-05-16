const {src, dest, watch, parallel} = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
//const webp = import('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css (done){
    
    src("src/scss/**/*.scss") // Identificar el archivo de Sass = src.
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); // Almacenarla en el disco duro. = dest.
    
    done(); // Callback que avisa a gulp cuando llegamos al final.
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,PNG,jpg,JPG}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done()
}

async function versionWebp (done){

    const webp = await import('gulp-webp');

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,PNG,jpg,JPG}')
        .pipe(webp.default(opciones))
        .pipe(dest('build/img'));

    done();
}

function versionAvif (done){

    //const webp = await import('gulp-avif');

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,PNG,jpg,JPG}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));

    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes, versionWebp, versionAvif, javascript, dev);

