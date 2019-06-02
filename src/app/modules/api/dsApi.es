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
      this.listeners = {};
    }
    on (eventName, fn) {
      initListener(this, eventName);
      this.listeners[eventName].push(fn);
    }
    off (eventName, fn) {
      let index;

      if (!Object.keys(this.listeners).includes(eventName)) {
        return;
      }

      index = this.listeners[eventName].indexOf(fn);
      this.listeners[eventName].splice(index, 1);
    }
    emit (eventName) {
      let args;
      if (!Object.keys(this.listeners).includes(eventName)) {
        return;
      }

      args = [...arguments];

      this.listeners[eventName].forEach(fn => {
        fn(args.slice(1))
      });
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

        emitRequestStart(dsApi);

        $http(opts).then(onComplete, reject);

        function onComplete () {
          emitRequestEnd(dsApi);
          resolve(...arguments);
        }
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

        emitRequestStart(dsApi);

        $http(opts).then(onComplete, reject);

        function onComplete () {
          emitRequestEnd(dsApi);
          resolve(...arguments);
        }
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

        emitRequestStart(dsApi);

        $http(opts).then(onComplete, reject);

        function onComplete () {
          emitRequestEnd(dsApi);
          resolve(...arguments);
        }
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

        emitRequestStart(dsApi);

        $http(opts).then(onComplete, reject);

        function onComplete () {
          emitRequestEnd(dsApi);
          resolve(...arguments);
        }
      });
    }
    watchApiProgress (scope, varName) {
      hideProgressIndicator();

      this.on('$apiRequest:start', function () {
        showProgressIndicator();
      });

      this.on('$apiRequest:end', function () {
        hideProgressIndicator();
      });

      function showProgressIndicator () {
        scope[varName] = true;
      }

      function hideProgressIndicator () {
        scope[varName] = false;
      }
    }
  }

  return new DsApi();

  function hasAuthorization () {
    return $auth.isAuthorized;
  }

  function getAuthorization () {
    return $auth.authorization;
  }

  function emitRequestStart ($api) {
    $api.emit('$apiRequest:start');
  }

  function emitRequestEnd ($api) {
    $api.emit('$apiRequest:end');
  }

  function initListener ($api, eventName) {
    if (Object.keys($api.listeners).includes(eventName)) {
      return;
    }

    $api.listeners[eventName] = [];
  }
}
