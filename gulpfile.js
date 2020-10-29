"use strict";

var path = {
  src: {
    app: 'app/',
    html: 'app/html/*.html',
    // css: 'app/css/**/*.scss',
    css: 'app/css/main.css',
    img: 'app/img/',
    imgjpeg: 'app/img/*.jpg',
    imgpng: 'app/img/*.png',
    imgSpriteIcons: 'app/img/sprite-icons/*.png',
    imgsvg: 'app/img/*.svg',
    imgSVG: 'app/img/svg/*.svg',
    js: 'app/js/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  build: {
    html: 'build/',
    img: 'build/img/',
    css: 'build/css/',
    svgSprite: 'build/img/sprite.svg',
    imgSpriteRes: 'app/img/sprite.png',
    imgSpriteCss: 'app/css/_sprite.css',
    js: 'build/js/',
    fonts: 'build/fonts/'
  },
  watch: {
    css: 'app/css/**/*.css',
    html: 'app/html/**/*.html',
    imgSVG: 'app/img/svg/*.svg',
    img: 'app/img/*',
    js: 'app/js/**/*.js',
    fonts: 'app/fonts/**/*.*'
  },
  deploy: {
    src: 'build/**',
    dest: 'likvidator',
    host: 'sperevgs.beget.tech',
    user: 'sperevgs_html',
    password: 'Ul5X&CGM'
  }
};

var gulp = require('gulp');

var rigger = require('gulp-rigger'),
  svgSprite = require('gulp-svg-sprite'),
  browserSync = require('browser-sync').create(),
  // sass = require('gulp-sass'),
  // sourcemaps = require('gulp-sourcemaps'),
  importCss = require('gulp-import-css'),
  cleanCss = require('gulp-clean-css'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  ftp = require('vinyl-ftp'),
  clean = require('gulp-clean'),
  spritesmith = require('gulp.spritesmith');

gulp.task('html', function (done) {
  gulp.src(path.src.html).pipe(rigger()).pipe(gulp.dest(path.build.html)).pipe(gulp.dest(path.src.app));
  done();
});
gulp.task('fonts', function (done) {
  gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
  done();
}); // image

gulp.task('image:svg', function (done) {
  gulp.src(path.src.imgSVG).pipe(svgSprite({
    mode: {
      stack: {
        sprite: "../sprite.svg"
      }
    }
  })).pipe(gulp.dest(path.src.img)).pipe(gulp.dest(path.build.img));
  gulp.src(path.src.img).pipe(gulp.dest(path.build.img));
  done();
});
gulp.task('image:img', function (done) {
  gulp.src(path.src.imgpng).pipe(gulp.dest(path.build.img));
  gulp.src(path.src.imgjpeg).pipe(gulp.dest(path.build.img));
  gulp.src(path.src.imgsvg).pipe(gulp.dest(path.build.img));
  done();
});
gulp.task('image:sprite', function (done) {
  // var spriteData =  gulp.src(path.src.imgSpriteIcons).pipe(spritesmith({
  //     imgName: '../img/sprite.png',
  //     cssName: '_sprite.css',
  //   }));

  // spriteData.img.pipe(gulp.dest('./app/img/')); // путь, куда сохраняем картинку
  // spriteData.css.pipe(gulp.dest('./app/css/')); // путь, куда сохраняем стили
 
  done();
});

gulp.task('css', function (done) {
  gulp.src(path.src.css).pipe(plumber()).pipe(importCss()).pipe(cleanCss({
    level: {
      2: {
        specialComments: 0
      }
    },
    format: 'keep-breaks'
  })).pipe(autoprefixer()).pipe(gulp.dest(path.build.css));
  done();
});
gulp.task('js', function (done) {
  gulp.src(path.src.js).pipe(gulp.dest(path.build.js));
  done();
});
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: path.src.app
    }
  });
});
gulp.task('build', gulp.series('html', 'fonts', 'css', 'js', 'image:img', 'image:svg', 'image:sprite'));
gulp.task('clean', function (done) {
  gulp.src(path.build.html, {
    read: false
  }).pipe(clean());
  done();
});
gulp.task('watch', function (done) {
  gulp.watch(path.watch.css, gulp.series('css'));
  gulp.watch(path.watch.fonts, gulp.series('fonts')).on('change', browserSync.reload);
  gulp.watch(path.watch.js, gulp.series('js')).on('change', browserSync.reload);
  gulp.watch(path.watch.html, gulp.series('html')).on('change', browserSync.reload);
  gulp.watch(path.watch.imgSVG, gulp.series('image:svg')).on('change', browserSync.reload);
  gulp.watch(path.watch.img, gulp.series('image:img')).on('change', browserSync.reload);
  return;
});
gulp.task('deploy', function (done) {
  var conn = ftp.create({
    host: path.deploy.host,
    user: path.deploy.user,
    password: path.deploy.password,
    parallel: 10 // log: gutil.log

  });
  return gulp.src([path.deploy.src], {
    buffer: false
  }).pipe(conn.dest(path.deploy.dest));
  done();
});
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));