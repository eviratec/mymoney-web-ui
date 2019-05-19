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
  .controller('AppController', AppController);

AppController.$inject = ['$scope', '$mdDialog', '$animate'];
function AppController (  $scope,   $mdDialog,   $animate) {

  $scope.showLegal = function ($event, docId) {
    let dialog = {
      controller: 'LegalDialogController',
      templateUrl: 'modules/app/html/dialog/' + docId + '.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true,
    };

    $mdDialog.show(dialog).then(function() {

    }, function() {

    });
  };


};


angular.module('MyMoneyWebui')
  .controller('LegalDialogController', LegalDialogController);

LegalDialogController.$inject = ['$scope', '$mdDialog'];
function LegalDialogController (  $scope,   $mdDialog) {

  $scope.hide = function() {
    $mdDialog.cancel();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function() {
    $mdDialog.hide();
  };

};
