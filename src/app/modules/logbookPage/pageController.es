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
  .controller('LogbookPageController', LogbookPageController);

LogbookPageController.$inject = ['$api', '$scope', '$state', '$mdDialog', '$timeout', 'logbook'];
function LogbookPageController (  $api,   $scope,   $state,   $mdDialog,   $timeout,   logbook) {

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

  const $logbookPage = this;

  const currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];
  const currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES[logbook.Currency];

  $logbookPage.logbook = logbook;
  $logbookPage.currencySymbol = currencySymbol;

  checkLogbookExists();

  function checkLogbookExists () {
    if (logbook) {
      return;
    }

    navToUserDashboard();
  }

  $logbookPage.createTransaction = function ($event) {

    var confirm = $mdDialog.prompt()
      .title('Transaction Summary')
      .placeholder('Groceries ...')
      .ariaLabel('Summary')
      .initialValue('')
      .targetEvent($event)
      .ok('Create Transaction')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(result) {
      createTransaction(result);
    }, function() {

    });

  };

  $logbookPage.deleteLogbook = function ($event) {

    let confirm = $mdDialog.confirm()
      .title('Are you sure?')
      .textContent(`This will permanently delete your logbook: ${logbook.Name}`)
      .ariaLabel('Delete logbook')
      .targetEvent($event)
      .ok('Delete Logbook')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      deleteLogbook(logbook.Id);
    }, function() {
      // do nothing
    });

  };

  $logbookPage.renameLogbook = function ($event) {

    var confirm = $mdDialog.prompt()
      .title('Rename Logbook')
      .placeholder(logbook.Name)
      .ariaLabel('Logbook name')
      .initialValue(logbook.Name)
      .targetEvent($event)
      .ok('Save')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(newValue) {
      renameLogbook(logbook.Id, newValue);
    }, function() {
      // do nothing
    });

  };

  function renameLogbook (logbookId, newValue) {
    if (logbook.Id !== logbookId) {
      return;
    }

    $api.apiPutNewValue(`/logbook/${logbookId}/name`, newValue)
      .then(function (res) {
        updateLogbookName(newValue);
        $scope.$emit(`logbook:renamed`, logbookId, newValue);
      })
      .catch(function (err) {
        console.log(err);
        notifyRenameLogbookError();
      });
  }

  function updateLogbookName (newValue) {
    $scope.$apply(function () {
      logbook.Name = newValue;
    });
  }

  function deleteLogbook (logbookId) {
    if (logbook.Id !== logbookId) {
      return;
    }

    $api.apiDelete(`/logbook/${logbookId}`)
      .then(function (res) {
        navToUserDashboard();
      })
      .catch(function (err) {
        console.log(err);
        notifyDeleteLogbookError();
      });
  }

  function notifyDeleteLogbookError () {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Error')
        .textContent('An unexpected error was encountered while deleting the logbook.')
        .ariaLabel('Error notification')
        .ok('Ok')
    );
  }

  function notifyRenameLogbookError () {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Error')
        .textContent('An unexpected error was encountered while renaming the logbook.')
        .ariaLabel('Error notification')
        .ok('Ok')
    );
  }

  function navToUserDashboard () {
    $state.go('app.user.dashboard');
  }

  function createTransaction (summary) {

    let newTransaction = {
      LogbookId: logbook.Id,
      Summary: summary,
      Amount: 100,
    };

    $api.apiPost('/transactions', newTransaction)
      .then(function (res) {
        $timeout(function () {
          Object.assign(newTransaction, res.data);
          newTransaction.Id = res.data.Id;
        });
      })
      .catch(function (err) {
        console.log(err);
      });

    $logbookPage.logbook.Transactions.push(newTransaction);

  }

};
