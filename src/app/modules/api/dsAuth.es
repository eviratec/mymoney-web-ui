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

angular.module('MyMoneyWebui.Api')
  .factory('$auth', dsAuthFactory);

dsAuthFactory.$inject = ['User', 'Token', '$rootScope', 'clientStore'];
function dsAuthFactory (  User,   Token,   $rootScope,   clientStore) {

  class Auth {
    constructor () {
      this.isAuthorized = false;
      this.token = null;
      this.user = null;
    }
    get authorization () {
      if (null === this.token) {
        return '';
      }
      return this.token.Key;
    }
    auth (key) {
      this.token = new Token(key);
      this.user = new User(this.token.UserId);
      this.isAuthorized = true;
      clientStore.setStoredToken(key);
      $rootScope.$emit('authorized');
      return this;
    }
    remove () {
      this.token = null;
      this.user = null;
      this.isAuthorized = false;
      clientStore.clearStoredToken();
      $rootScope.$emit('unauthorized');
      return this;
    }
  }

  return new Auth();

}
