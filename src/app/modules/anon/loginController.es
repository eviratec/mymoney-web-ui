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
  .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$auth', '$state', '$mdDialog', '$login', '$timeout'];
function LoginController (  $scope,   $auth,   $state,   $mdDialog,   $login,   $timeout) {

  $scope.error = '';

  $scope.showProgress = false;

  $scope.credentials = {
    Login: '',
    Password: '',
  };

  $scope.onSubmit = function ($ev) {

    $ev.preventDefault();

    showProgressBar();

    let login = $scope.credentials.Login;
    let password = $scope.credentials.Password;

    $login(login, password)
      .then(function () {

      })
      .catch(err => {
        let errorMsg = '';
        if (err.data && err.data.ErrorMsg) {
           errorMsg = err.data.ErrorMsg;
        }

        hideProgressBar();

        if (!errorMsg) {
          return;
        }

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Login failed')
            .textContent('Invalid username/password combination')
            .ariaLabel('Login error dialog')
            .ok('Got it!')
            .targetEvent($ev)
        );

        $timeout(function () {
          $scope.error = 'Invalid username/password combination';
        });
      });

  };

  function showProgressBar () {
    $scope.showProgress = true;
  }

  function hideProgressBar () {
    $scope.showProgress = false;
  }

};
