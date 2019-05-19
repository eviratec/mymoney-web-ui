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
  .factory('$signup', dsSignupFactory);

dsSignupFactory.$inject = ['$auth', '$api'];
function dsSignupFactory (  $auth,   $api) {
  return function (Email, NewPassword) {
    return new Promise((resolve, reject) => {
      $api.apiPost('/signups', {
        Email: Email,
        NewPassword: NewPassword,
      })
      .then(res => {
        if (202 === res.status) {
          return resolve();
        }
        reject(new Error(res.data.Error || "UNKNOWN_ERROR_408392"));
      })
      .catch(res => {
        if (400 === res.status) {
          return reject(res.data.ErrorMsg)
        }
        console.log(res);
        reject(new Error("UNKNOWN_ERROR_408393"))
      });
    });
  };
};
