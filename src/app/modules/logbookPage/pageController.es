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

  const logbookPageDays = [];

  $logbookPage.logbook = logbook;
  $logbookPage.currencySymbol = currencySymbol;
  $logbookPage.currencyDecimalPlaces = currencyDecimalPlaces;
  $logbookPage.currencyAmountMultiplier = Math.pow(10, currencyDecimalPlaces);

  $logbookPage.days = logbookPageDays;

  checkLogbookExists();

  initLogbookDays();

  function checkLogbookExists () {
    if (logbook) {
      return;
    }

    navToUserDashboard();
  }

  $logbookPage.createTransaction = function ($event) {

    let createTransactionDialog = {
      controller: 'CreateTransactionDialogController',
      templateUrl: 'modules/logbookPage/html/dialogs/createTransaction.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true,
      locals: {
        logbook: logbook,
      },
    };

    $mdDialog.show(createTransactionDialog).then(function(data) {
      createTransaction(data);
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

  function createTransaction (data) {
    let newTransaction;
    let amount = parseAmount(data.Amount);

    if ('debit' === data.Type) {
      amount = 0 - amount;
    }

    newTransaction = {
      LogbookId: logbook.Id,
      Summary: data.Summary,
      Amount: amount,
      Occurred: data.Occurred,
    };

    $api.apiPost('/transactions', newTransaction)
      .then(function (res) {
        $timeout(function () {
          Object.assign(newTransaction, res.data);
          newTransaction.Id = res.data.Id;
          $scope.$emit(`logbook:transaction`, logbook.Id, amount, 0);
        });
      })
      .catch(function (err) {
        console.log(err);
      });

    $logbookPage.logbook.Transactions.push(newTransaction);

    addTransactionToLogbookDay(newTransaction);
  }

  function parseAmount (amount) {
    let decPlaces = currencyDecimalPlaces;
    let newAmount = amount;

    if (newAmount.indexOf('.') === -1) {
      newAmount += '.00';
    }

    newAmount = newAmount.replace(/[^\d.]/g, '').split('.');
    newAmount = Number([
      newAmount[0],
      newAmount[1].substr(0, decPlaces).padEnd(decPlaces, '0')
    ].join(''));

    return newAmount;
  }


  function addTransactionToLogbookDay (transaction) {
    let date = getTransactionDayDate(transaction);
    let logbookDay = getLogbookDayByDate(date);

    if (null === logbookDay) {
      logbookDay = addLogbookDay(date);
    }

    logbookDay.transactions.push(transaction);
  }

  function getTransactionDayDate (transaction) {
    return (new Date(transaction.Occurred*1000)).toJSON().split('T')[0];
  }

  function initLogbookDays () {
    logbook.Transactions.forEach(addTransactionToLogbookDay);
  }

  function addLogbookDay (date) {
    let transactions = [];
    let logbookDay = {};

    Object.defineProperties(logbookDay, {
      date: {
        value: date,
        enumerable: true,
      },
      transactions: {
        value: transactions,
        enumerable: true,
      },
    });

    logbookPageDays.push(logbookDay);

    return logbookDay;
  }

  function getLogbookDayByDate (date) {
    let logbookDay = logbookPageDays.filter(day => {
      return day.date === date;
    })[0];

    if (!logbookDay) {
      return null;
    }

    return logbookDay;
  }
};
