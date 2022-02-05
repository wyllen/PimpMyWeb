var gulp = require("gulp");
var glob = require("glob");
var gulpSass = require("gulp-sass");
var dartSass = require("sass");
var browserSync = require("browser-sync").create();
var sass = gulpSass(dartSass);

const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, "");

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

var config = {
  // CHANGE THIS!
  remoteURL: arg.website,

  srcDir: "./" + arg.folder,
  injectDir: "./" + arg.folder + "/dist",
  localPath: "/local-assets",

  localAssets: {
    css: ["css/**/*.css"],
    js: ["js/**/*.js"],
  },
};

gulp.task("sass", function () {
  return gulp
    .src(config.srcDir + "/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(config.injectDir + "/css"))
    .pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp
    .src(config.srcDir + "/js/**/*.js")
    .pipe(gulp.dest(config.injectDir + "/js"))
    .pipe(browserSync.stream());
});

gulp.task(
  "browser-sync",
  gulp.series("sass", "js", function () {
    browserSync.init({
      proxy: {
        target: config.remoteURL,
        ws: true,
      },
      rewriteRules: [
        {
          // Inject Local CSS at the end of HEAD
          match: /<\/head>/i,
          fn: function (req, res, match) {
            var localCssAssets = "";
            for (var i = 0; i < config.localAssets.css.length; i++) {
              var files = glob.sync(config.localAssets.css[i], {
                cwd: config.injectDir,
              });

              for (var file in files) {
                localCssAssets +=
                  '<link rel="stylesheet" type="text/css" href="' +
                  config.localPath +
                  "/" +
                  files[file] +
                  '">';
              }
            }

            return localCssAssets + match;
          },
        },
        {
          // Inject Local JS at the end of BODY
          match: /<\/body>/i,
          fn: function (req, res, match) {
            var localJsAssets = "";
            for (var i = 0; i < config.localAssets.js.length; i++) {
              var files = glob.sync(config.localAssets.js[i], {
                cwd: config.injectDir,
              });

              for (var file in files) {
                localJsAssets +=
                  '<script src="' +
                  config.localPath +
                  "/" +
                  files[file] +
                  '"></script>';
              }
            }

            return localJsAssets + match;
          },
        },
      ],
      serveStatic: [
        {
          route: config.localPath,
          dir: config.injectDir,
        },
      ],
      watchTask: true,
      https: true,
    });

    gulp.watch("wikipedia/scss/**/*.scss", gulp.series("sass"));
    gulp.watch("wikipedia/js/**/*.js", gulp.series("js"));
  })
);

gulp.task("default", gulp.series("sass", "browser-sync"));
