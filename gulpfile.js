const gulp =        require('gulp');

//html
const fileInclude = require('gulp-file-include');
const htmlclean   = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');

//SASS
const sass =         require('gulp-sass')(require('sass'));
const sassGlob =     require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer');
const csso =         require('gulp-csso');
const webpCss =      require('gulp-webp-css');

const server =      require('gulp-server-livereload');
const clean =       require('gulp-clean');
const fs =          require('fs');
const sourseMaps =  require('gulp-sourcemaps');
const plumber =     require('gulp-plumber');
const notify =      require('gulp-notify');
const webpack =     require('webpack-stream');
const babel =       require('gulp-babel');

// img
const imagemin =    require('gulp-imagemin');
const webp       =  require('gulp-webp');


const changed  =    require('gulp-changed');
const groupMedia =  require('gulp-group-css-media-queries');




const srcFolder = './src';
const buildFolder = './app';
const docsFolder = './docs';

const paths = {
    srcHtml: `${srcFolder}/html/**/*.html`,
    srcScss: `${srcFolder}/scss/*.scss`,
    buildScss: `${buildFolder}/css/`,
    srcImg: `${srcFolder}/img/**/*`,
    buildImg: `${buildFolder}/img/`,
    srcFonts: `${srcFolder}/fonts/**/*`,
    buildFonts: `${buildFolder}/fonts/`,
    srcjs: `${srcFolder}/js/*.js`,
    buildjs: `${buildFolder}/js/`,


    docsScss: `${docsFolder}/css/`,
    docsImg: `${docsFolder}/img/`,
    docsFonts: `${docsFolder}/fonts/`,
    docsjs: `${docsFolder}/js/`,


    watchScss: `${srcFolder}/scss/**/*.scss`,
    watchHtml: `${srcFolder}/**/*.html`,
    watchImg: `${srcFolder}/img/**/*`,
    watchFonts: `${srcFolder}/fonts/**/*`,
    watchjs: `${srcFolder}/js/**/*.js`,

    notbuild: `!${srcFolder}/html/blocks/*.html`
};


// plumber const
const plumberNotify = (title) => {
    return{
        errorHandler: notify.onError({
        title: title,
        message: 'Error <%= error.message %>'
    }) 
    }
}
// plumber const

//clean_____________________________________
const cleanApp = (done) => {
    if(fs.existsSync(buildFolder)){
        return gulp.src(buildFolder, {read: false})
        .pipe(clean({force: true}))
    }
    done()
}
// docs version
const cleanDocs = (done) => {
    if(fs.existsSync(docsFolder)){
        return gulp.src(docsFolder, {read: false})
        .pipe(clean({force: true}))
    }
    done()
}
//clean_____________________________________

//html_____________________________________
const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file'
};

const htmlApp = () => {
    return gulp.src([paths.srcHtml, paths.notbuild])
    .pipe(changed(buildFolder, {hasChanged: changed.compareContents}))
    .pipe(plumber(plumberNotify('html')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest(buildFolder)) 
}
// docs version
const htmlDocs = () => {
    return gulp.src([paths.srcHtml, paths.notbuild])
    .pipe(changed(docsFolder))
    .pipe(plumber(plumberNotify('html')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest(docsFolder)) 
}
//html_____________________________________

//scss_____________________________________
const stylesApp = () => {
    return gulp.src(paths.srcScss)
    .pipe(changed(paths.buildScss))
    .pipe(plumber(plumberNotify('styles')))
    .pipe(sourseMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest(paths.buildScss))
}

// docs version
const stylesDocs = () => {
    return gulp.src(paths.srcScss)
    .pipe(changed(paths.docsScss))
    .pipe(plumber(plumberNotify('styles')))
    .pipe(sourseMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest(paths.docsScss))
}
//scss_____________________________________

//img_____________________________________
const copyImagesApp = () => {
    return gulp.src(paths.srcImg)
    .pipe(changed(paths.buildImg))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest(paths.buildImg))
}
// docs version
const copyImagesDocs = () => {
    return gulp.src(paths.srcImg)
    .pipe(changed(paths.docsImg))

    .pipe(webp())
    .pipe(gulp.dest(paths.docsImg))

    .pipe(gulp.src(paths.srcImg))
    .pipe(changed(paths.docsImg))


    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest(paths.docsImg))
}
//img_____________________________________


//fonts_____________________________________
const copyFontsApp = () => {
    return gulp.src(paths.srcFonts)
    .pipe(changed(paths.buildFonts))
    .pipe(gulp.dest(paths.buildFonts))
}
// docs version
const copyFontsDocs = () => {
    return gulp.src(paths.srcFonts)
    .pipe(changed(paths.docsFonts))
    .pipe(gulp.dest(paths.docsFonts))
}
//fonts_____________________________________

//js webpack_____________________________________
const jsApp = () => {
    return gulp.src(paths.srcjs)
    .pipe(changed(paths.buildjs))
    .pipe(plumber(plumberNotify('js')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.buildjs))
}
// docs version
const jsDocs = () => {
    return gulp.src(paths.srcjs)
    .pipe(changed(paths.docsjs))
    .pipe(plumber(plumberNotify('js')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.docsjs))
}

//js webpack_____________________________________



//liveserver______________________________
const serverOptions = {
    livereload: true,
    open: true
}

const  startServer = () => {
    return gulp.src(buildFolder)
    .pipe(server(serverOptions))
}

const  startServerDocs = () => {
    return gulp.src(docsFolder)
    .pipe(server(serverOptions))
}
//liveserver_______________________________

//watch_______________________________
const watch = () => {
    gulp.watch(paths.watchScss, gulp.parallel('stylesApp'));
    gulp.watch(paths.watchHtml, gulp.parallel('htmlApp'));
    gulp.watch(paths.watchImg, gulp.parallel('copyImagesApp'));
    gulp.watch(paths.watchFonts, gulp.parallel('copyFontsApp'));
    gulp.watch(paths.watchjs, gulp.parallel('jsApp'));
}
//watch_______________________________



exports.htmlApp = htmlApp;
exports.stylesApp = stylesApp;
exports.copyImagesApp = copyImagesApp;
exports.startServer = startServer;
exports.cleanApp = cleanApp;
exports.watch = watch;
exports.copyFontsApp = copyFontsApp;
exports.jsApp = jsApp;

exports.cleanDocs =cleanDocs;
exports.htmlDocs = htmlDocs;
exports.stylesDocs = stylesDocs;
exports.copyImagesDocs = copyImagesDocs;
exports.copyFontsDocs = copyFontsDocs;
exports.jsDocs = jsDocs;
exports.startServerDocs = startServerDocs;

exports.default = gulp.series(cleanApp, 
    gulp.parallel(htmlApp, stylesApp, copyImagesApp, copyFontsApp, jsApp), 
    gulp.parallel(startServer, watch));

exports.finish = gulp.series(cleanDocs,
    gulp.parallel(htmlDocs, stylesDocs, copyImagesDocs, copyFontsDocs, jsDocs),
     gulp.parallel(startServerDocs));