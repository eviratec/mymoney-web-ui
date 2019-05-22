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

angular.module('MyMoneyWebui.UserDashboard')
  .controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$mdDialog', 'userLogbooks'];
function DashboardController (  $scope,   $mdDialog,   userLogbooks) {

  const CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€',
  };

  const CURRENCY_DECIMAL_PLACES = {
    aud: 2,
    usd: 2,
    gbp: 2,
    eur: 2,
  };

  $scope.logbooks = userLogbooks;

  $scope.currencySymbols = CURRENCY_SYMBOLS;
  $scope.currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES;

  $scope.abs = Math.abs;
  $scope.pow = Math.pow;

};
