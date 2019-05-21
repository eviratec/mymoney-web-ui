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

angular.module('MyMoneyWebui.LogbookPage')
  .controller('CreateTransactionDialogController', CreateTransactionDialogController);

CreateTransactionDialogController.$inject = ['$scope', '$timeout', '$mdDialog', 'logbook'];
function CreateTransactionDialogController (  $scope,   $timeout,   $mdDialog,   logbook) {
  const CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€',
  };

  $scope.currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];

  $scope.$data = {
    Summary: '',
    Type: 'credit',
    Amount: '1.00'
  };

  $scope.logbook = logbook;

  $scope.hide = function() {
    $mdDialog.cancel();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function() {
    $mdDialog.hide($scope.$data);
  };
}
