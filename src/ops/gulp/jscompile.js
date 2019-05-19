/**
 * Copyright (c) 2019 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

const templateCache = require('gulp-angular-templatecache');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

module.exports = function (gulp) {

  gulp.task('jscompile', function () {

    let paths = [
      'src/app/modules/app/module.es',
      'src/app/modules/app/config.es',
      'src/app/modules/app/routes.es',
      'src/app/modules/app/*Controller.es',
      'src/app/modules/app/*.es',
      'src/app/modules/*/module.es',
      'src/app/modules/*/config.es',
      'src/app/modules/*/routes.es',
      'src/app/modules/*/*Controller.es',
      'src/app/modules/*/*.es',
      '.tmp/templates.js',
    ];

    gulp.src(paths)
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build'));

  });

  gulp.task('tplcachecompile', function () {
    return gulp.src('src/app/**/*/html/**/*.html')
      .pipe(templateCache('templates.js', { module: 'MyMoneyWebui' }))
      .pipe(gulp.dest('.tmp'));
  });

  gulp.task('vendorjscompile', function () {

    let paths = [];
    let deps = [
      'angular',
      'angular-animate',
      'angular-aria',
      'angular-cookies',
      'angular-material',
      'angular-messages',
      'angular-environment-config',
    ];

    deps.forEach(vendorModule => {
      paths.push(`node_modules/${vendorModule}/**/*${vendorModule}.min.js`);
    });

    // UI router new path
    paths.push(`node_modules/@uirouter/angularjs/release/angular-ui-router.min.js`);
    // paths.push(`node_modules/@uirouter/angularjs/release/ui-router-angularjs.js`);

    gulp.src(paths)
      .pipe(concat('vendor.js', {newLine: ';'}))
      .pipe(gulp.dest('build'));

  });

  gulp.task('jsmin', function () {
    let firstComment = true;
    gulp.src('build/app.js')
      .pipe(minify({
        ext: {
          min: '.min.js',
        },
        mangle: true,
        preserveComments: function () {
          if (!firstComment) {
            return false;
          }
          firstComment = false;
          return true;
        },
      }))
      .pipe(gulp.dest('build'));
  });

};
