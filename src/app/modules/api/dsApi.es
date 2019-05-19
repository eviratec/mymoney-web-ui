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
  .factory('$api', dsApiFactory);

dsApiFactory.$inject = ['$auth', '$appEnvironment', '$http'];
function dsApiFactory (  $auth,   $appEnvironment,   $http) {

  const PUT = 'put';
  const POST = 'post';
  const GET = 'get';
  const DELETE = 'delete';

  class DsApi {
    constructor () {
      this.url = $appEnvironment.config.apiUrl;
    }
    apiGet (url) {
      let dsApi = this;
      return new Promise((resolve, reject) => {
        let authorization = this.authorization;
        let opts = {
          method: GET,
          url: dsApi.url + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };

        if (hasAuthorization()) {
          opts.headers['Authorization'] = getAuthorization();
        }

        $http(opts).then(resolve, reject);
      });
    }
    apiPost (url, d) {
      let dsApi = this;
      return new Promise((resolve, reject) => {
        let authorization = this.authorization;
        let opts = {
          method: POST,
          url: dsApi.url + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };

        if (hasAuthorization()) {
          opts.headers['Authorization'] = getAuthorization();
        }

        if (d) {
          opts.data = JSON.stringify(d);
        }

        $http(opts).then(resolve, reject);
      });
    }
    apiPutNewValue (url, newValue) {
      let dsApi = this;
      return new Promise((resolve, reject) => {
        let authorization = this.authorization;
        let opts = {
          method: PUT,
          url: dsApi.url + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };

        if (hasAuthorization()) {
          opts.headers['Authorization'] = getAuthorization();
        }

        opts.data = JSON.stringify({
          newValue: newValue,
        });

        $http(opts).then(resolve, reject);
      });
    }
    apiDelete (url) {
      let dsApi = this;
      return new Promise((resolve, reject) => {
        let authorization = this.authorization;
        let opts = {
          method: DELETE,
          url: dsApi.url + url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        };

        if (hasAuthorization()) {
          opts.headers['Authorization'] = getAuthorization();
        }

        $http(opts).then(resolve, reject);
      });
    }
  }

  return new DsApi();

  function hasAuthorization () {
    return $auth.isAuthorized;
  }
  function getAuthorization () {
    return $auth.authorization;
  }

}
