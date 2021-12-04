const { dest, parallel, series, src, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const sync = require("browser-sync");
const del = require("del");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const scss = require("gulp-sass")(require("sass"));
const imagemin = require("gulp-imagemin");

// HTML

const html = () => {
  return src("src/*.html")
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"))
    .pipe(sync.stream());
};

// Styles

const styles = () => {
  return src("src/scss/styles.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("styles.min.css"))
    .pipe(autoprefixer())
    .pipe(dest("dist/css"))
    .pipe(sync.stream());
};

// Scripts

const scripts = () => {
  return src("src/js/main.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(sync.stream());
};

// Images

const images = () => {
  return src("src/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"))
    .pipe(sync.stream());
};

// Fonts

const fonts = () => {
  return src("src/fonts/*").pipe(dest("dist/fonts")).pipe(sync.stream());
};

// Server

const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: "dist",
    },
  });
};

// Clean

const clean = () => {
  return del("dist");
};

// Watch

const watchFiles = () => {
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/js/*.js"], scripts);
  watch(["src/*.html"], html);
  watch(["src/images/*"], images);
  watch(["src/fonts/*"], fonts);
};

// Build

const build = series(clean, parallel(html, styles, scripts, images, fonts));

// Watch

const watcher = parallel(build, watchFiles, server);

// Exports

exports.default = watcher;
exports.build = build;
