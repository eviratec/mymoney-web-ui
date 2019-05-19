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

angular.module('MyMoneyWebui.Anon')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider

      .state('app.anon', {
        templateUrl: 'modules/anon/html/root.html',
        controller: 'AnonController',
        controllerAs: '$anon',
        abstract: true,
        resolve: {
          authorized: ['$auth', '$state', function ($auth, $state) {
            if ($auth.isAuthorized) {
              $state.go('app.user.dashboard');
            }
            return $auth.isAuthorized;
          }]
        }
      })

      .state('app.anon.login', {
        url: '/login',
        templateUrl: 'modules/anon/html/login.html',
      })

      .state('app.anon.signup', {
        url: '/signup',
        templateUrl: 'modules/anon/html/signup.html',
      });

}]);
