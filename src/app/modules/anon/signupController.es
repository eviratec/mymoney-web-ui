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
  .controller('SignupController', SignupController);

SignupController.$inject = ['$state', '$scope', '$signup', '$timeout', '$mdDialog'];
function SignupController (  $state,   $scope,   $signup,   $timeout,   $mdDialog) {

  disableSignup();

  $scope.error = '';
  $scope.signupEnabled = true;

  $scope.showProgress = false;

  $scope.newUser = {
    EmailAddress: '',
    Password: '',
  };

  $scope.passwordConfirmation = '';

  enableSignup();

  function notifyFormInvalid () {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Error')
        .textContent('Please complete all form fields correctly')
        .ariaLabel('Error notification')
        .ok('Ok')
    );
  }

  $scope.submit = function ($ev) {

    if (!$scope.signupForm.$valid) {
      notifyFormInvalid();
      return;
    }

    disableSignup();

    $ev.preventDefault();

    showProgressBar();

    let email = $scope.newUser.EmailAddress;
    let password = $scope.newUser.Password;

    $signup(email, password)
      .then(() => {
        let d = $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Success!')
          .textContent('Your account has been created')
          .ariaLabel('Signup success notification')
          .ok('Awesome!')
          .targetEvent($ev);
        $mdDialog.show(d).then(() => {
          $state.go('app.anon.login');
        });
      })
      .catch((errorMsg) => {
        hideProgressBar();

        let d = $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Signup failed')
          .textContent(errorMsg)
          .ariaLabel('Signup error notification')
          .ok('Got it!')
          .targetEvent($ev);

        $mdDialog.show(d).then(() => {
          enableSignup();
        });

        $timeout(function () {
          $scope.error = errorMsg[2];
        });
      });

  };

  function enableSignup () {
    $scope.signupEnabled = true;
  }

  function disableSignup () {
    $scope.signupEnabled = false;
  }

  function showProgressBar () {
    $scope.showProgress = true;
  }

  function hideProgressBar () {
    $scope.showProgress = false;
  }

};
