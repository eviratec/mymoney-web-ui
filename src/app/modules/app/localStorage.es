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
  .constant('TOKEN_KEY', 'TE7_TOKEN_KEY');

angular.module('MyMoneyWebui')
  .provider('$localStorage', localStorageProvider);

localStorageProvider.$inject = [];
function localStorageProvider () {
  this.$get = function () {
    return window.localStorage;
  };
}

angular.module('MyMoneyWebui')
  .factory('clientStore', clientStore);

clientStore.$inject = ['$localStorage', 'TOKEN_KEY'];
function clientStore (  $localStorage,   TOKEN_KEY) {

  return {
    hasStoredToken: function () {
      return !!(TOKEN_KEY in $localStorage && $localStorage[TOKEN_KEY]);
    },
    getStoredToken: function () {
      return TOKEN_KEY in $localStorage && $localStorage[TOKEN_KEY] || null;
    },
    setStoredToken: function (newValue) {
      return $localStorage.setItem(TOKEN_KEY, newValue);
    },
    clearStoredToken: function () {
      return $localStorage.removeItem(TOKEN_KEY);
    },
    clearEverything: function () {
      return $localStorage.clear();
    },
  };

}
