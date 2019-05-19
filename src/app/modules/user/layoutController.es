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

angular.module('MyMoneyWebui.User')
  .controller('LayoutController', LayoutController);

LayoutController.$inject = ['$scope', '$mdDialog', '$mdToast', '$logout', '$mdSidenav'];
function LayoutController (  $scope,   $mdDialog,   $mdToast,   $logout,   $mdSidenav) {

  let originatorEv;

  $scope.toggleSidenav = function (menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.changePassword = function () {
    $mdToast.show(
      $mdToast.simple()
      .content('Password clicked!')
      .position('top right')
      .hideDelay(2000)
    );
  };

  $scope.changeProfile = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/modules/layouts/main-page/user-dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $mdToast.show(
        $mdToast.simple()
        .content('You said the information was "' + answer + '".')
        .position('top right')
        .hideDelay(2000)
      );

    }, function() {
      $mdToast.show(
        $mdToast.simple()
        .content('You cancelled the dialog.')
        .position('top right')
        .hideDelay(2000)
      );
    });

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
  };


  $scope.logout = function () {
    $logout();
  };

  $scope.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

};
