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

angular.module('MyMoneyWebui')
  .config(appDefaultRoute)
  .config(appEnvironment)
  .config(appLocation)
  .config(appThemes)
  .run(appInit)

appEnvironment.$inject = ['$appEnvironmentProvider'];
function appEnvironment (  $appEnvironmentProvider) {

  $appEnvironmentProvider
    .setDefaults({
      titlePrefix: '??? :: ',
      apiUrl: 'http://localhost:3580',
    })
    .addEnvironment('local', ['127.0.0.1', 'localhost', /\.localhost$/i], {
      titlePrefix: 'LOCAL :: ',
      apiUrl: 'http://localhost:3580',
    })
    .addEnvironment('prod', 'my.moneylog.xyz', {
      titlePrefix: '',
      apiUrl: 'https://api.moneylog.xyz',
    })
    .addEnvironment('prod2', 'https://my.moneylog.xyz', {
      titlePrefix: '',
      apiUrl: 'https://api.moneylog.xyz',
    })
    .defaultEnvironmentName('local');

}

appLocation.$inject = ['$locationProvider'];
function appLocation (  $locationProvider) {
  $locationProvider.html5Mode(true);
}

appDefaultRoute.$inject = ['$urlRouterProvider'];
function appDefaultRoute (  $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');
}

appThemes.$inject = ['$mdThemingProvider'];
function appThemes (  $mdThemingProvider) {

  let dsPurpleMap;
  let sidebarBlueGreyMap;

  dsPurpleMap = $mdThemingProvider.extendPalette('light-blue', {
    // '800': '#8E24AA',
    'contrastDefaultColor': 'light'
  });

  $mdThemingProvider.definePalette('dsPurple', dsPurpleMap);

  $mdThemingProvider.theme('default')
    .primaryPalette('dsPurple');

  sidebarBlueGreyMap = $mdThemingProvider.extendPalette('blue-grey', {
    // 'contrastDefaultColor': 'dark',
  });

  $mdThemingProvider.definePalette('sidebarBlueGrey', sidebarBlueGreyMap);

  $mdThemingProvider.theme('darknav')
    .primaryPalette('dsPurple')
    .dark();

  $mdThemingProvider.theme('sidenavTheme')
    .primaryPalette('grey')
    .dark();

}

appInit.$inject = ['$appEnvironment', '$document'];
function appInit (  $appEnvironment,   $document) {

  let robotoFontSrc;
  let linkEl;

  $document[0].title = $appEnvironment.config.titlePrefix
    + 'MoneyLog';

  robotoFontSrc = "https://fonts.googleapis.com/css?family=Roboto:200,300,400,500";
  linkEl = $document[0].createElement('link');

  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", robotoFontSrc);

  $document[0].body.appendChild(linkEl);

}
