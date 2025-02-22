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

angular.module('MyMoneyWebui.TransactionPage')
  .controller('TransactionPageController', TransactionPageController);

TransactionPageController.$inject = ['$api', '$scope', '$state', '$mdDialog', '$timeout', 'transaction'];
function TransactionPageController (  $api,   $scope,   $state,   $mdDialog,   $timeout,   transaction) {

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

  const $transactionPage = this;

  const logbook = transaction.Logbook;

  const currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];
  const currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES[logbook.Currency];

  $transactionPage.transaction = transaction;

  $transactionPage.navToParent = function ($event) {
    navToParent();
  };

  $transactionPage.deleteTransaction = function ($event) {

    let confirm = $mdDialog.confirm()
      .title('Are you sure?')
      .textContent(
        `This will permanently delete your transaction: ${transaction.Summary}`
      )
      .ariaLabel('Delete transaction')
      .targetEvent($event)
      .ok('Delete Transaction')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      deleteTransaction(transaction.Id);
    }, function() {
      // do nothing
    });

  };

  $transactionPage.changeSummary = function ($event) {

    let confirm = $mdDialog.prompt()
      .title('Change Transaction Summary')
      .placeholder(transaction.Summary)
      .ariaLabel('Transaction Summary')
      .initialValue(transaction.Summary)
      .targetEvent($event)
      .ok('Save')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(newValue) {
      changeSummary(transaction.Id, newValue);
    }, function() {
      // do nothing
    });

  };

  $transactionPage.changeAmount = function ($event) {
    let confirm;

    let oldAmount = String(transaction.Amount);

    oldAmount = [
      oldAmount.substr(0, oldAmount.length-currencyDecimalPlaces),
      oldAmount.substr(-currencyDecimalPlaces),
    ].join('.');

    confirm = $mdDialog.prompt()
      .title('Change Transaction Amount')
      .placeholder(oldAmount)
      .ariaLabel(`Transaction Amount (${currencySymbol})`)
      .initialValue(oldAmount)
      .targetEvent($event)
      .ok('Save')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(newValue) {
      let decPlaces = currencyDecimalPlaces;
      let newAmount = newValue;
      let isDebit = '-' === newAmount[0];

      if (newAmount.indexOf('.') === -1) {
        newAmount += '.00';
      }

      newAmount = newAmount.replace(/[^\d.]/g, '').split('.');
      newAmount = Number([
        newAmount[0],
        newAmount[1].substr(0, decPlaces).padEnd(decPlaces, '0')
      ].join(''));

      if (isDebit) {
        newAmount = 0 - newAmount;
      }

      changeAmount(transaction.Id, newAmount, transaction.Amount);
    }, function() {
      // do nothing
    });

  };

  $transactionPage.changeOccurred = function ($event) {

    let changeTransactionOccurredDialog = {
      controller: 'ChangeTransactionOccurredDialogController',
      templateUrl: 'modules/transactionPage/html/dialogs/changeOccurred.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true,
      locals: {
        transaction: transaction,
      },
    };

    $mdDialog.show(changeTransactionOccurredDialog).then(function(newValue) {
      changeOccurred(transaction.Id, newValue/1000);
    }, function() {

    });

  };

  function changeSummary (transactionId, newValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue(`/transaction/${transactionId}/summary`, newValue)
      .then(function (res) {
        updateTransactionSummary(newValue);
      })
      .catch(function (err) {
        console.log(err);
        notifyUpdateTransactionError();
      });
  }

  function updateTransactionSummary (newValue) {
    $scope.$apply(function () {
      transaction.Summary = newValue;
    });
  }

  function changeAmount (transactionId, newValue, oldValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue(`/transaction/${transactionId}/amount`, newValue)
      .then(function (res) {
        updateTransactionAmount(newValue, oldValue);
      })
      .catch(function (err) {
        console.log(err);
        notifyUpdateTransactionError();
      });
  }

  function updateTransactionAmount (newValue, oldValue) {
    $scope.$apply(function () {
      transaction.Amount = newValue;
    });
    $scope.$emit(`logbook:transaction`, logbook.Id, newValue, oldValue);
  }

  function changeOccurred (transactionId, newValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue(`/transaction/${transactionId}/occurred`, newValue)
      .then(function (res) {
        updateTransactionOccurred(newValue);
      })
      .catch(function (err) {
        console.log(err);
        notifyUpdateTransactionError();
      });
  }

  function updateTransactionOccurred (newValue) {
    $scope.$apply(function () {
      transaction.Occurred = newValue;
    });
  }

  function deleteTransaction (transactionId) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiDelete(`/transaction/${transactionId}`)
      .then(function (res) {
        $scope.$emit(`logbook:transaction`, logbook.Id, 0, transaction.Amount);
        navToParent();
      })
      .catch(function (err) {
        console.log(err);
        notifyDeleteTransactionError();
      });
  }

  function notifyDeleteTransactionError () {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Error')
        .textContent(
          'An unexpected error was encountered while deleting the transaction.'
        )
        .ariaLabel('Error notification')
        .ok('Ok')
    );
  }

  function notifyUpdateTransactionError () {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Error')
        .textContent(
          'An unexpected error was encountered while updating the transaction.'
        )
        .ariaLabel('Error notification')
        .ok('Ok')
    );
  }

  function navToParent () {
    $state.go('app.user.logbookPage', { logbookId: transaction.LogbookId });
  }

};
