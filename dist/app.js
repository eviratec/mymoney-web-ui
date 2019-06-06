'use strict';

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

angular.module('MyMoneyWebui', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment', 'MyMoneyWebui.Api', 'MyMoneyWebui.Anon', 'MyMoneyWebui.User', 'MyMoneyWebui.LogbookPage', 'MyMoneyWebui.TransactionPage']);
'use strict';

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

angular.module('MyMoneyWebui').config(appDefaultRoute).config(appEnvironment).config(appLocation).config(appThemes).run(appInit);

appEnvironment.$inject = ['$appEnvironmentProvider'];
function appEnvironment($appEnvironmentProvider) {

  $appEnvironmentProvider.setDefaults({
    titlePrefix: '??? :: ',
    apiUrl: 'http://localhost:3580'
  }).addEnvironment('local', ['127.0.0.1', 'localhost', /\.localhost$/i], {
    titlePrefix: 'LOCAL :: ',
    apiUrl: 'http://localhost:3580'
  }).addEnvironment('prod', 'my.moneylog.xyz', {
    titlePrefix: '',
    apiUrl: 'https://api.moneylog.xyz'
  }).addEnvironment('prod2', 'https://my.moneylog.xyz', {
    titlePrefix: '',
    apiUrl: 'https://api.moneylog.xyz'
  }).defaultEnvironmentName('local');
}

appLocation.$inject = ['$locationProvider'];
function appLocation($locationProvider) {
  $locationProvider.html5Mode(true);
}

appDefaultRoute.$inject = ['$urlRouterProvider'];
function appDefaultRoute($urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');
}

appThemes.$inject = ['$mdThemingProvider'];
function appThemes($mdThemingProvider) {

  var dsLightBlueMap = void 0;
  var sidebarBlueGreyMap = void 0;

  dsLightBlueMap = $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light'
  });

  $mdThemingProvider.definePalette('dsLightBlue', dsLightBlueMap);

  $mdThemingProvider.theme('default').primaryPalette('dsLightBlue').dark();

  sidebarBlueGreyMap = $mdThemingProvider.extendPalette('blue-grey', {
    // 'contrastDefaultColor': 'dark',
  });

  $mdThemingProvider.definePalette('sidebarBlueGrey', sidebarBlueGreyMap);

  $mdThemingProvider.theme('darknav').primaryPalette('dsLightBlue').dark();

  $mdThemingProvider.theme('sidenavTheme').primaryPalette('grey').dark();
}

appInit.$inject = ['$appEnvironment', '$document'];
function appInit($appEnvironment, $document) {

  var robotoFontSrc = void 0;
  var linkEl = void 0;

  $document[0].title = $appEnvironment.config.titlePrefix + 'MoneyLog';

  robotoFontSrc = "https://fonts.googleapis.com/css?family=Roboto:200,300,400,500";
  linkEl = $document[0].createElement('link');

  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", robotoFontSrc);

  $document[0].body.appendChild(linkEl);
}
'use strict';

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

angular.module('MyMoneyWebui').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app', {
    templateUrl: 'modules/app/html/app.html',
    controller: 'AppController',
    controllerAs: '$app',
    abstract: true,
    resolve: {
      _auth: ['$auth', 'clientStore', function ($auth, clientStore) {
        if (clientStore.hasStoredToken()) {
          return $auth.auth(clientStore.getStoredToken());
        }
        return $auth;
      }]
    }
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui').controller('AppController', AppController);

AppController.$inject = ['$scope', '$mdDialog', '$animate'];
function AppController($scope, $mdDialog, $animate) {

  $scope.showLegal = function ($event, docId) {
    var dialog = {
      controller: 'LegalDialogController',
      templateUrl: 'modules/app/html/dialog/' + docId + '.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true
    };

    $mdDialog.show(dialog).then(function () {}, function () {});
  };
};

angular.module('MyMoneyWebui').controller('LegalDialogController', LegalDialogController);

LegalDialogController.$inject = ['$scope', '$mdDialog'];
function LegalDialogController($scope, $mdDialog) {

  $scope.hide = function () {
    $mdDialog.cancel();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function () {
    $mdDialog.hide();
  };
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

angular.module('MyMoneyWebui').factory('$app', dsAppFactory);

dsAppFactory.$inject = ['clientStore', 'Token'];
function dsAppFactory(clientStore, Token) {

  var $app = void 0;

  var App = function () {
    function App() {
      _classCallCheck(this, App);

      this.user = null;
      this.loggedin = false;
    }

    _createClass(App, [{
      key: 'login',
      value: function login() {}
    }, {
      key: 'logout',
      value: function logout() {}
    }, {
      key: 'auth',
      value: function auth(tokenKey) {
        var token = new Token(tokenKey);
      }
    }]);

    return App;
  }();

  $app = new App();

  if (clientStore.hasStoredToken()) {
    $app.auth(clientStore.getStoredToken());
  }

  return $app;
}
'use strict';

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

angular.module('MyMoneyWebui').constant('TOKEN_KEY', 'TE7_TOKEN_KEY');

angular.module('MyMoneyWebui').provider('$localStorage', localStorageProvider);

localStorageProvider.$inject = [];
function localStorageProvider() {
  this.$get = function () {
    return window.localStorage;
  };
}

angular.module('MyMoneyWebui').factory('clientStore', clientStore);

clientStore.$inject = ['$localStorage', 'TOKEN_KEY'];
function clientStore($localStorage, TOKEN_KEY) {

  return {
    hasStoredToken: function hasStoredToken() {
      return !!(TOKEN_KEY in $localStorage && $localStorage[TOKEN_KEY]);
    },
    getStoredToken: function getStoredToken() {
      return TOKEN_KEY in $localStorage && $localStorage[TOKEN_KEY] || null;
    },
    setStoredToken: function setStoredToken(newValue) {
      return $localStorage.setItem(TOKEN_KEY, newValue);
    },
    clearStoredToken: function clearStoredToken() {
      return $localStorage.removeItem(TOKEN_KEY);
    },
    clearEverything: function clearEverything() {
      return $localStorage.clear();
    }
  };
}
'use strict';

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

angular.module('MyMoneyWebui.Anon', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment', 'MyMoneyWebui.Api']);
'use strict';

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

angular.module('MyMoneyWebui.Api', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment']);
'use strict';

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

angular.module('MyMoneyWebui.LogbookPage', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment']);
'use strict';

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

angular.module('MyMoneyWebui.TransactionPage', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment']);
'use strict';

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

angular.module('MyMoneyWebui.User', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment', 'MyMoneyWebui.UserDashboard']);
'use strict';

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

angular.module('MyMoneyWebui.UserDashboard', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMaterial', 'ngMessages', 'ui.router', 'luminous.environment']);
'use strict';

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

angular.module('MyMoneyWebui.Anon').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app.anon', {
    templateUrl: 'modules/anon/html/root.html',
    controller: 'AnonController',
    controllerAs: '$anon',
    abstract: true,
    resolve: {
      authorized: ['$auth', '$state', function ($auth, $state) {
        if ($auth.isAuthorized) {
          $state.go('app.user.dashboard');
        }
        return $auth.isAuthorized;
      }]
    }
  }).state('app.anon.login', {
    url: '/login',
    templateUrl: 'modules/anon/html/login.html'
  }).state('app.anon.signup', {
    url: '/signup',
    templateUrl: 'modules/anon/html/signup.html'
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui.LogbookPage').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app.user.logbookPage', {
    url: '/logbook/:logbookId',
    templateUrl: 'modules/logbookPage/html/page.html',
    controller: 'LogbookPageController',
    controllerAs: '$logbookPage',
    resolve: {
      logbook: ['$api', '$stateParams', function ($api, $stateParams) {
        var logbookId = $stateParams.logbookId;
        return $api.apiGet('/logbook/' + logbookId).then(function (res) {
          return res.data;
        }).catch(function (err) {
          console.log(err);
          return {};
        });
      }]
    }
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui.TransactionPage').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app.user.transactionPage', {
    url: '/transaction/:transactionId',
    templateUrl: 'modules/transactionPage/html/page.html',
    controller: 'TransactionPageController',
    controllerAs: '$transactionPage',
    resolve: {
      transaction: ['$api', '$stateParams', function ($api, $stateParams) {
        var transactionId = $stateParams.transactionId;
        return $api.apiGet('/transaction/' + transactionId).then(function (res) {
          return res.data;
        }).catch(function (err) {
          console.log(err);
          return {};
        });
      }]
    }
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui.User').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app.user', {
    templateUrl: 'modules/user/html/root.html',
    controller: 'UserController',
    controllerAs: '$user',
    abstract: true,
    resolve: {
      userLogbooks: ['$api', function ($api) {
        return $api.apiGet('/logbooks/all').then(function (res) {
          return res.data;
        }).catch(function (err) {
          console.log(err);
          return [];
        });
      }],
      user: ['$auth', '$api', '$state', function ($auth, $api, $state) {
        try {
          return $api.apiGet('/user/' + $auth.user.Id).then(function (res) {
            return res.data;
          }).catch(function (err) {
            $state.go('app.anon.login');
          });
        } catch (err) {
          $state.go('app.anon.login');
        }
      }]
    }
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui.UserDashboard').config(['$stateProvider', function ($stateProvider) {

  $stateProvider.state('app.user.dashboard', {
    url: '/dashboard',
    templateUrl: 'modules/userDashboard/html/dashboard.html',
    controller: 'DashboardController'
  });
}]);
'use strict';

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

angular.module('MyMoneyWebui.Anon').controller('AnonController', AnonController);

AnonController.$inject = ['$rootScope', '$scope', '$state', '$auth'];
function AnonController($rootScope, $scope, $state, $auth) {

  $rootScope.$on('authorized', function () {
    $state.go('app.user.dashboard');
  });

  if ($auth.isAuthorized) {
    $state.go('app.user.dashboard');
  }
};
'use strict';

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

angular.module('MyMoneyWebui.Anon').controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$auth', '$state', '$mdDialog', '$login', '$timeout'];
function LoginController($scope, $auth, $state, $mdDialog, $login, $timeout) {

  $scope.error = '';

  $scope.showProgress = false;

  $scope.credentials = {
    Login: '',
    Password: ''
  };

  $scope.onSubmit = function ($ev) {

    $ev.preventDefault();

    showProgressBar();

    var login = $scope.credentials.Login;
    var password = $scope.credentials.Password;

    $login(login, password).then(function () {}).catch(function (err) {
      var errorMsg = '';
      if (err.data && err.data.ErrorMsg) {
        errorMsg = err.data.ErrorMsg;
      }

      hideProgressBar();

      if (!errorMsg) {
        return;
      }

      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Login failed').textContent('Invalid username/password combination').ariaLabel('Login error dialog').ok('Got it!').targetEvent($ev));

      $timeout(function () {
        $scope.error = 'Invalid username/password combination';
      });
    });
  };

  function showProgressBar() {
    $scope.showProgress = true;
  }

  function hideProgressBar() {
    $scope.showProgress = false;
  }
};
'use strict';

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

angular.module('MyMoneyWebui.Anon').controller('SignupController', SignupController);

SignupController.$inject = ['$state', '$scope', '$signup', '$timeout', '$mdDialog'];
function SignupController($state, $scope, $signup, $timeout, $mdDialog) {

  disableSignup();

  $scope.error = '';
  $scope.signupEnabled = true;

  $scope.showProgress = false;

  $scope.touAccepted = false;

  $scope.newUser = {
    EmailAddress: '',
    Password: ''
  };

  $scope.passwordConfirmation = '';

  enableSignup();

  $scope.back = function ($ev) {
    $ev.preventDefault();
  };

  function notifyFormInvalid() {
    $mdDialog.show($mdDialog.alert().title('Please fill in all fields').textContent('Please complete all form fields correctly.').ariaLabel('Error notification').ok('Ok'));
  }

  $scope.submit = function ($ev) {

    if (!$scope.signupForm.$valid) {
      notifyFormInvalid();
      return;
    }

    disableSignup();

    $ev.preventDefault();

    showProgressBar();

    var email = $scope.newUser.EmailAddress;
    var password = $scope.newUser.Password;

    $signup(email, password).then(function () {
      var d = $mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Success!').textContent('Your account has been created').ariaLabel('Signup success notification').ok('Awesome!').targetEvent($ev);
      $mdDialog.show(d).then(function () {
        $state.go('app.anon.login');
      });
    }).catch(function (errorMsg) {
      hideProgressBar();

      var d = $mdDialog.alert().parent(angular.element(document.body)).clickOutsideToClose(true).title('Signup failed').textContent(errorMsg).ariaLabel('Signup error notification').ok('Got it!').targetEvent($ev);

      $mdDialog.show(d).then(function () {
        enableSignup();
      });

      $timeout(function () {
        $scope.error = errorMsg[2];
      });
    });
  };

  function enableSignup() {
    $scope.signupEnabled = true;
  }

  function disableSignup() {
    $scope.signupEnabled = false;
  }

  function showProgressBar() {
    $scope.showProgress = true;
  }

  function hideProgressBar() {
    $scope.showProgress = false;
  }
};
'use strict';

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

angular.module('MyMoneyWebui.LogbookPage').controller('CreateTransactionDialogController', CreateTransactionDialogController);

CreateTransactionDialogController.$inject = ['$scope', '$timeout', '$mdDialog', 'logbook'];
function CreateTransactionDialogController($scope, $timeout, $mdDialog, logbook) {
  var CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€'
  };

  $scope.currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];

  $scope.$data = {
    Summary: '',
    Type: 'credit',
    Amount: '1.00',
    Occurred: new Date(Math.round(Date.now() / 1000) * 1000)
  };

  $scope.logbook = logbook;

  $scope.hide = function () {
    $mdDialog.cancel();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function () {
    $mdDialog.hide({
      Summary: $scope.$data.Summary,
      Type: $scope.$data.Type,
      Amount: $scope.$data.Amount,
      Occurred: $scope.$data.Occurred.getTime() / 1000
    });
  };
}
'use strict';

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

angular.module('MyMoneyWebui.LogbookPage').controller('LogbookPageController', LogbookPageController);

LogbookPageController.$inject = ['$api', '$scope', '$state', '$mdDialog', '$timeout', 'logbook'];
function LogbookPageController($api, $scope, $state, $mdDialog, $timeout, logbook) {

  var CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€'
  };

  var CURRENCY_DECIMAL_PLACES = {
    aud: 2,
    usd: 2,
    gbp: 2,
    eur: 2
  };

  var $logbookPage = this;

  var currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];
  var currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES[logbook.Currency];

  var logbookPageDays = [];

  $logbookPage.logbook = logbook;
  $logbookPage.currencySymbol = currencySymbol;
  $logbookPage.currencyDecimalPlaces = currencyDecimalPlaces;
  $logbookPage.currencyAmountMultiplier = Math.pow(10, currencyDecimalPlaces);

  $logbookPage.days = logbookPageDays;

  checkLogbookExists();

  initLogbookDays();

  function checkLogbookExists() {
    if (logbook) {
      return;
    }

    navToUserDashboard();
  }

  $logbookPage.abs = Math.abs;

  $logbookPage.createTransaction = function ($event) {

    var createTransactionDialog = {
      controller: 'CreateTransactionDialogController',
      templateUrl: 'modules/logbookPage/html/dialogs/createTransaction.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true,
      locals: {
        logbook: logbook
      }
    };

    $mdDialog.show(createTransactionDialog).then(function (data) {
      createTransaction(data);
    }, function () {});
  };

  $logbookPage.deleteLogbook = function ($event) {

    var confirm = $mdDialog.confirm().title('Are you sure?').textContent('This will permanently delete your logbook: ' + logbook.Name).ariaLabel('Delete logbook').targetEvent($event).ok('Delete Logbook').cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      deleteLogbook(logbook.Id);
    }, function () {
      // do nothing
    });
  };

  $logbookPage.renameLogbook = function ($event) {

    var confirm = $mdDialog.prompt().title('Rename Logbook').placeholder(logbook.Name).ariaLabel('Logbook name').initialValue(logbook.Name).targetEvent($event).ok('Save').cancel('Cancel');

    $mdDialog.show(confirm).then(function (newValue) {
      renameLogbook(logbook.Id, newValue);
    }, function () {
      // do nothing
    });
  };

  function renameLogbook(logbookId, newValue) {
    if (logbook.Id !== logbookId) {
      return;
    }

    $api.apiPutNewValue('/logbook/' + logbookId + '/name', newValue).then(function (res) {
      updateLogbookName(newValue);
      $scope.$emit('logbook:renamed', logbookId, newValue);
    }).catch(function (err) {
      console.log(err);
      notifyRenameLogbookError();
    });
  }

  function updateLogbookName(newValue) {
    $scope.$apply(function () {
      logbook.Name = newValue;
    });
  }

  function deleteLogbook(logbookId) {
    if (logbook.Id !== logbookId) {
      return;
    }

    $api.apiDelete('/logbook/' + logbookId).then(function (res) {
      navToUserDashboard();
    }).catch(function (err) {
      console.log(err);
      notifyDeleteLogbookError();
    });
  }

  function notifyDeleteLogbookError() {
    $mdDialog.show($mdDialog.alert().title('Error').textContent('An unexpected error was encountered while deleting the logbook.').ariaLabel('Error notification').ok('Ok'));
  }

  function notifyRenameLogbookError() {
    $mdDialog.show($mdDialog.alert().title('Error').textContent('An unexpected error was encountered while renaming the logbook.').ariaLabel('Error notification').ok('Ok'));
  }

  function navToUserDashboard() {
    $state.go('app.user.dashboard');
  }

  function createTransaction(data) {
    var newTransaction = void 0;
    var amount = parseAmount(data.Amount);

    if ('debit' === data.Type) {
      amount = 0 - amount;
    }

    newTransaction = {
      LogbookId: logbook.Id,
      Summary: data.Summary,
      Amount: amount,
      Occurred: data.Occurred
    };

    $api.apiPost('/transactions', newTransaction).then(function (res) {
      $timeout(function () {
        Object.assign(newTransaction, res.data);
        newTransaction.Id = res.data.Id;
        $scope.$emit('logbook:transaction', logbook.Id, amount, 0);
      });
    }).catch(function (err) {
      console.log(err);
    });

    $logbookPage.logbook.Transactions.push(newTransaction);

    addTransactionToLogbookDay(newTransaction);
  }

  function parseAmount(amount) {
    var decPlaces = currencyDecimalPlaces;
    var newAmount = amount;

    if (newAmount.indexOf('.') === -1) {
      newAmount += '.00';
    }

    newAmount = newAmount.replace(/[^\d.]/g, '').split('.');
    newAmount = Number([newAmount[0], newAmount[1].substr(0, decPlaces).padEnd(decPlaces, '0')].join(''));

    return newAmount;
  }

  function addTransactionToLogbookDay(transaction) {
    var date = getTransactionDayDate(transaction);
    var logbookDay = getLogbookDayByDate(date);

    if (null === logbookDay) {
      logbookDay = addLogbookDay(date);
    }

    logbookDay.transactions.push(transaction);
    recalcLogbookDayTotal(logbookDay);
  }

  function recalcLogbookDayTotal(logbookDay) {
    var newTotal = 0;
    logbookDay.transactions.forEach(function (transaction) {
      newTotal += transaction.Amount;
    });
    logbookDay.total = newTotal;
  }

  function getTransactionDayDate(transaction) {
    var date = new Date(transaction.Occurred * 1000);

    return [date.getFullYear(), (date.getMonth() + 1).toString().padStart(2, '0'), date.getDate().toString().padStart(2, '0')].join('-');
  }

  function initLogbookDays() {
    logbook.Transactions.forEach(addTransactionToLogbookDay);
  }

  function addLogbookDay(date) {
    var total = 0;
    var transactions = [];
    var logbookDay = {};

    Object.defineProperties(logbookDay, {
      date: {
        value: date,
        enumerable: true
      },
      total: {
        value: total,
        enumerable: true,
        writable: true
      },
      transactions: {
        value: transactions,
        enumerable: true
      }
    });

    logbookPageDays.push(logbookDay);

    return logbookDay;
  }

  function getLogbookDayByDate(date) {
    var logbookDay = logbookPageDays.filter(function (day) {
      return day.date === date;
    })[0];

    if (!logbookDay) {
      return null;
    }

    return logbookDay;
  }
};
'use strict';

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

angular.module('MyMoneyWebui.TransactionPage').controller('ChangeTransactionOccurredDialogController', ChangeTransactionOccurredDialogController);

ChangeTransactionOccurredDialogController.$inject = ['$scope', '$timeout', '$mdDialog', 'transaction'];
function ChangeTransactionOccurredDialogController($scope, $timeout, $mdDialog, transaction) {
  $scope.$data = {
    Occurred: new Date(transaction.Occurred * 1000)
  };

  $scope.hide = function () {
    $mdDialog.cancel();
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function () {
    $mdDialog.hide($scope.$data.Occurred.getTime());
  };
}
'use strict';

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

angular.module('MyMoneyWebui.TransactionPage').controller('TransactionPageController', TransactionPageController);

TransactionPageController.$inject = ['$api', '$scope', '$state', '$mdDialog', '$timeout', 'transaction'];
function TransactionPageController($api, $scope, $state, $mdDialog, $timeout, transaction) {

  var CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€'
  };

  var CURRENCY_DECIMAL_PLACES = {
    aud: 2,
    usd: 2,
    gbp: 2,
    eur: 2
  };

  var $transactionPage = this;

  var logbook = transaction.Logbook;

  var currencySymbol = CURRENCY_SYMBOLS[logbook.Currency];
  var currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES[logbook.Currency];

  $transactionPage.transaction = transaction;

  $transactionPage.navToParent = function ($event) {
    navToParent();
  };

  $transactionPage.deleteTransaction = function ($event) {

    var confirm = $mdDialog.confirm().title('Are you sure?').textContent('This will permanently delete your transaction: ' + transaction.Summary).ariaLabel('Delete transaction').targetEvent($event).ok('Delete Transaction').cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      deleteTransaction(transaction.Id);
    }, function () {
      // do nothing
    });
  };

  $transactionPage.changeSummary = function ($event) {

    var confirm = $mdDialog.prompt().title('Change Transaction Summary').placeholder(transaction.Summary).ariaLabel('Transaction Summary').initialValue(transaction.Summary).targetEvent($event).ok('Save').cancel('Cancel');

    $mdDialog.show(confirm).then(function (newValue) {
      changeSummary(transaction.Id, newValue);
    }, function () {
      // do nothing
    });
  };

  $transactionPage.changeAmount = function ($event) {
    var confirm = void 0;

    var oldAmount = String(transaction.Amount);

    oldAmount = [oldAmount.substr(0, oldAmount.length - currencyDecimalPlaces), oldAmount.substr(-currencyDecimalPlaces)].join('.');

    confirm = $mdDialog.prompt().title('Change Transaction Amount').placeholder(oldAmount).ariaLabel('Transaction Amount (' + currencySymbol + ')').initialValue(oldAmount).targetEvent($event).ok('Save').cancel('Cancel');

    $mdDialog.show(confirm).then(function (newValue) {
      var decPlaces = currencyDecimalPlaces;
      var newAmount = newValue;
      var isDebit = '-' === newAmount[0];

      if (newAmount.indexOf('.') === -1) {
        newAmount += '.00';
      }

      newAmount = newAmount.replace(/[^\d.]/g, '').split('.');
      newAmount = Number([newAmount[0], newAmount[1].substr(0, decPlaces).padEnd(decPlaces, '0')].join(''));

      if (isDebit) {
        newAmount = 0 - newAmount;
      }

      changeAmount(transaction.Id, newAmount, transaction.Amount);
    }, function () {
      // do nothing
    });
  };

  $transactionPage.changeOccurred = function ($event) {

    var changeTransactionOccurredDialog = {
      controller: 'ChangeTransactionOccurredDialogController',
      templateUrl: 'modules/transactionPage/html/dialogs/changeOccurred.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      fullscreen: true,
      locals: {
        transaction: transaction
      }
    };

    $mdDialog.show(changeTransactionOccurredDialog).then(function (newValue) {
      changeOccurred(transaction.Id, newValue / 1000);
    }, function () {});
  };

  function changeSummary(transactionId, newValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue('/transaction/' + transactionId + '/summary', newValue).then(function (res) {
      updateTransactionSummary(newValue);
    }).catch(function (err) {
      console.log(err);
      notifyUpdateTransactionError();
    });
  }

  function updateTransactionSummary(newValue) {
    $scope.$apply(function () {
      transaction.Summary = newValue;
    });
  }

  function changeAmount(transactionId, newValue, oldValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue('/transaction/' + transactionId + '/amount', newValue).then(function (res) {
      updateTransactionAmount(newValue, oldValue);
    }).catch(function (err) {
      console.log(err);
      notifyUpdateTransactionError();
    });
  }

  function updateTransactionAmount(newValue, oldValue) {
    $scope.$apply(function () {
      transaction.Amount = newValue;
    });
    $scope.$emit('logbook:transaction', logbook.Id, newValue, oldValue);
  }

  function changeOccurred(transactionId, newValue) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiPutNewValue('/transaction/' + transactionId + '/occurred', newValue).then(function (res) {
      updateTransactionOccurred(newValue);
    }).catch(function (err) {
      console.log(err);
      notifyUpdateTransactionError();
    });
  }

  function updateTransactionOccurred(newValue) {
    $scope.$apply(function () {
      transaction.Occurred = newValue;
    });
  }

  function deleteTransaction(transactionId) {
    if (transaction.Id !== transactionId) {
      return;
    }

    $api.apiDelete('/transaction/' + transactionId).then(function (res) {
      $scope.$emit('logbook:transaction', logbook.Id, 0, transaction.Amount);
      navToParent();
    }).catch(function (err) {
      console.log(err);
      notifyDeleteTransactionError();
    });
  }

  function notifyDeleteTransactionError() {
    $mdDialog.show($mdDialog.alert().title('Error').textContent('An unexpected error was encountered while deleting the transaction.').ariaLabel('Error notification').ok('Ok'));
  }

  function notifyUpdateTransactionError() {
    $mdDialog.show($mdDialog.alert().title('Error').textContent('An unexpected error was encountered while updating the transaction.').ariaLabel('Error notification').ok('Ok'));
  }

  function navToParent() {
    $state.go('app.user.logbookPage', { logbookId: transaction.LogbookId });
  }
};
'use strict';

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

angular.module('MyMoneyWebui.User').controller('LayoutController', LayoutController);

LayoutController.$inject = ['$scope', '$mdDialog', '$mdToast', '$logout', '$mdSidenav'];
function LayoutController($scope, $mdDialog, $mdToast, $logout, $mdSidenav) {

  var originatorEv = void 0;

  $scope.toggleSidenav = function (menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.changePassword = function () {
    $mdToast.show($mdToast.simple().content('Password clicked!').position('top right').hideDelay(2000));
  };

  $scope.changeProfile = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'app/modules/layouts/main-page/user-dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function (answer) {
      $mdToast.show($mdToast.simple().content('You said the information was "' + answer + '".').position('top right').hideDelay(2000));
    }, function () {
      $mdToast.show($mdToast.simple().content('You cancelled the dialog.').position('top right').hideDelay(2000));
    });

    function DialogController($scope, $mdDialog) {
      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }
  };

  $scope.logout = function () {
    $logout();
  };

  $scope.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
};
'use strict';

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

angular.module('MyMoneyWebui.User').controller('SidenavController', SidenavController);

SidenavController.$inject = ['$scope', '$mdSidenav'];
function SidenavController($scope, $mdSidenav) {

  $scope.toggleSidenav = function (menuId) {
    $mdSidenav(menuId).toggle();
  };
};
'use strict';

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

angular.module('MyMoneyWebui.User').controller('UserController', UserController);

UserController.$inject = ['$api', '$scope', '$rootScope', '$auth', '$state', '$mdDialog', '$timeout', 'user', 'userLogbooks'];
function UserController($api, $scope, $rootScope, $auth, $state, $mdDialog, $timeout, user, userLogbooks) {

  $rootScope.$on('unauthorized', function () {
    $state.go('app.anon.login');
  });

  if (!$auth.isAuthorized) {
    $state.go('app.anon.login');
  }

  $api.watchApiProgress($scope, 'showProgress');

  $scope.showSidenavLogbooks = true;
  $scope.logbooks = userLogbooks;
  $scope.user = user;

  $scope.login = user.Login;

  $scope.$on('logbook:renamed', updateLogbookName);
  $scope.$on('logbook:transaction', updateLogbookBalance);

  $scope.createLogbook = function ($event) {

    var confirm = $mdDialog.prompt().title('Name your new logbook').placeholder('My Logbook').ariaLabel('Logbook name').initialValue('').targetEvent($event).ok('Create Logbook').cancel('Cancel');

    $mdDialog.show(confirm).then(function (result) {
      createLogbook(result);
    }, function () {});
  };

  function createLogbook(name) {

    var newLogbook = {
      Name: name
    };

    $api.apiPost('/logbooks', newLogbook).then(function (res) {
      $timeout(function () {
        Object.assign(newLogbook, res.data);
        newLogbook.Id = res.data.Id;
        newLogbook.Balance = 0;
      });
    }).catch(function (err) {
      console.log(err);
    });

    $scope.logbooks.push(newLogbook);
  }

  function updateLogbookBalance($event, logbookId, newValue, oldValue) {
    var logbook = getUserLogbookById(logbookId);
    $scope.$apply(function () {
      logbook.Balance = logbook.Balance + calcDiff(oldValue, newValue);
    });
  }

  function updateLogbookName($event, logbookId, newValue) {
    var logbook = getUserLogbookById(logbookId);
    $scope.$apply(function () {
      logbook.Name = newValue;
    });
  }

  function getUserLogbookById(logbookId) {
    return userLogbooks.filter(function (logbook) {
      return logbook.Id === logbookId;
    })[0];
  }

  function calcDiff(oldValue, newValue) {
    var oldValueIsNeg = oldValue < 0; // old value is less than zero
    var oldValueIsPos = oldValue > 0; // old value is greater than zero
    var newValueIsNeg = newValue < 0; // new value is less than zero
    var newValueIsPos = newValue > 0; // new value is greater than zero

    var negToPos = oldValueIsNeg && newValueIsPos; // convert neg to pos
    var posToNeg = oldValueIsPos && newValueIsNeg; // convert pos to neg

    var isNeg = oldValueIsNeg && newValueIsNeg; // both numbers are negative

    if (posToNeg) {
      return 0 - (oldValue + Math.abs(newValue));
    }

    if (negToPos) {
      return Math.abs(oldValue) + newValue;
    }

    if (isNeg) {
      return Math.abs(oldValue) - Math.abs(newValue);
    }

    return 0 - oldValue + newValue;
  }
};
'use strict';

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

angular.module('MyMoneyWebui.UserDashboard').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$mdDialog', 'userLogbooks'];
function DashboardController($scope, $mdDialog, userLogbooks) {

  var CURRENCY_SYMBOLS = {
    aud: '$',
    usd: '$',
    gbp: '£',
    eur: '€'
  };

  var CURRENCY_DECIMAL_PLACES = {
    aud: 2,
    usd: 2,
    gbp: 2,
    eur: 2
  };

  $scope.logbooks = userLogbooks;

  $scope.currencySymbols = CURRENCY_SYMBOLS;
  $scope.currencyDecimalPlaces = CURRENCY_DECIMAL_PLACES;

  $scope.abs = Math.abs;
  $scope.pow = Math.pow;
};
'use strict';

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

angular.module('MyMoneyWebui.Anon').directive('mustMatch', MustMatchDirective);

MustMatchDirective.$inject = [];
function MustMatchDirective() {
  return {
    require: 'ngModel',
    link: function link(scope, elm, attrs, ctrl) {
      ctrl.$validators.mustMatch = function (modelValue, viewValue) {
        // Value of other field this one must match
        var matchTargetValue = scope.$eval(attrs.mustMatch);
        if (modelValue === matchTargetValue) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

angular.module('MyMoneyWebui.Api').factory('$api', dsApiFactory);

dsApiFactory.$inject = ['$auth', '$appEnvironment', '$http'];
function dsApiFactory($auth, $appEnvironment, $http) {

  var PUT = 'put';
  var POST = 'post';
  var GET = 'get';
  var DELETE = 'delete';

  var DsApi = function () {
    function DsApi() {
      _classCallCheck(this, DsApi);

      this.url = $appEnvironment.config.apiUrl;
      this.listeners = {};
    }

    _createClass(DsApi, [{
      key: 'on',
      value: function on(eventName, fn) {
        initListener(this, eventName);
        this.listeners[eventName].push(fn);
      }
    }, {
      key: 'off',
      value: function off(eventName, fn) {
        var index = void 0;

        if (!Object.keys(this.listeners).includes(eventName)) {
          return;
        }

        index = this.listeners[eventName].indexOf(fn);
        this.listeners[eventName].splice(index, 1);
      }
    }, {
      key: 'emit',
      value: function emit(eventName) {
        var args = void 0;
        if (!Object.keys(this.listeners).includes(eventName)) {
          return;
        }

        args = [].concat(Array.prototype.slice.call(arguments));

        this.listeners[eventName].forEach(function (fn) {
          fn(args.slice(1));
        });
      }
    }, {
      key: 'apiGet',
      value: function apiGet(url) {
        var _this = this;

        var dsApi = this;
        return new Promise(function (resolve, reject) {
          var authorization = _this.authorization;
          var opts = {
            method: GET,
            url: dsApi.url + url,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          };

          if (hasAuthorization()) {
            opts.headers['Authorization'] = getAuthorization();
          }

          emitRequestStart(dsApi);

          $http(opts).then(onComplete, reject);

          function onComplete() {
            emitRequestEnd(dsApi);
            resolve.apply(undefined, arguments);
          }
        });
      }
    }, {
      key: 'apiPost',
      value: function apiPost(url, d) {
        var _this2 = this;

        var dsApi = this;
        return new Promise(function (resolve, reject) {
          var authorization = _this2.authorization;
          var opts = {
            method: POST,
            url: dsApi.url + url,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          };

          if (hasAuthorization()) {
            opts.headers['Authorization'] = getAuthorization();
          }

          if (d) {
            opts.data = JSON.stringify(d);
          }

          emitRequestStart(dsApi);

          $http(opts).then(onComplete, reject);

          function onComplete() {
            emitRequestEnd(dsApi);
            resolve.apply(undefined, arguments);
          }
        });
      }
    }, {
      key: 'apiPutNewValue',
      value: function apiPutNewValue(url, newValue) {
        var _this3 = this;

        var dsApi = this;
        return new Promise(function (resolve, reject) {
          var authorization = _this3.authorization;
          var opts = {
            method: PUT,
            url: dsApi.url + url,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          };

          if (hasAuthorization()) {
            opts.headers['Authorization'] = getAuthorization();
          }

          opts.data = JSON.stringify({
            newValue: newValue
          });

          emitRequestStart(dsApi);

          $http(opts).then(onComplete, reject);

          function onComplete() {
            emitRequestEnd(dsApi);
            resolve.apply(undefined, arguments);
          }
        });
      }
    }, {
      key: 'apiDelete',
      value: function apiDelete(url) {
        var _this4 = this;

        var dsApi = this;
        return new Promise(function (resolve, reject) {
          var authorization = _this4.authorization;
          var opts = {
            method: DELETE,
            url: dsApi.url + url,
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          };

          if (hasAuthorization()) {
            opts.headers['Authorization'] = getAuthorization();
          }

          emitRequestStart(dsApi);

          $http(opts).then(onComplete, reject);

          function onComplete() {
            emitRequestEnd(dsApi);
            resolve.apply(undefined, arguments);
          }
        });
      }
    }, {
      key: 'watchApiProgress',
      value: function watchApiProgress(scope, varName) {
        hideProgressIndicator();

        this.on('$apiRequest:start', function () {
          showProgressIndicator();
        });

        this.on('$apiRequest:end', function () {
          hideProgressIndicator();
        });

        function showProgressIndicator() {
          scope[varName] = true;
        }

        function hideProgressIndicator() {
          scope[varName] = false;
        }
      }
    }]);

    return DsApi;
  }();

  return new DsApi();

  function hasAuthorization() {
    return $auth.isAuthorized;
  }

  function getAuthorization() {
    return $auth.authorization;
  }

  function emitRequestStart($api) {
    $api.emit('$apiRequest:start');
  }

  function emitRequestEnd($api) {
    $api.emit('$apiRequest:end');
  }

  function initListener($api, eventName) {
    if (Object.keys($api.listeners).includes(eventName)) {
      return;
    }

    $api.listeners[eventName] = [];
  }
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

angular.module('MyMoneyWebui.Api').factory('$auth', dsAuthFactory);

dsAuthFactory.$inject = ['User', 'Token', '$rootScope', 'clientStore'];
function dsAuthFactory(User, Token, $rootScope, clientStore) {
  var Auth = function () {
    function Auth() {
      _classCallCheck(this, Auth);

      this.isAuthorized = false;
      this.token = null;
      this.user = null;
    }

    _createClass(Auth, [{
      key: 'auth',
      value: function auth(key) {
        this.token = new Token(key);
        this.user = new User(this.token.UserId);
        this.isAuthorized = true;
        clientStore.setStoredToken(key);
        $rootScope.$emit('authorized');
        return this;
      }
    }, {
      key: 'remove',
      value: function remove() {
        this.token = null;
        this.user = null;
        this.isAuthorized = false;
        clientStore.clearStoredToken();
        $rootScope.$emit('unauthorized');
        return this;
      }
    }, {
      key: 'authorization',
      get: function get() {
        if (null === this.token) {
          return '';
        }
        return this.token.Key;
      }
    }]);

    return Auth;
  }();

  return new Auth();
}
'use strict';

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

angular.module('MyMoneyWebui.Api').factory('$login', dsLoginFactory);

dsLoginFactory.$inject = ['$auth', '$api'];
function dsLoginFactory($auth, $api) {
  return function (Login, Password) {
    return new Promise(function (resolve, reject) {
      $api.apiPost('/auth/attempts', {
        Login: Login,
        Password: Password
      }).then(function (res) {
        var token = res.data.Token;
        if (token) {
          $auth.auth(token.Key);
          return resolve();
        }
        reject(new Error(res.data.Error));
      }).catch(reject);
    });
  };
};
'use strict';

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

angular.module('MyMoneyWebui.Api').factory('$logout', dsLogoutFactory);

dsLogoutFactory.$inject = ['$auth', '$api'];
function dsLogoutFactory($auth, $api) {
  return function () {
    return new Promise(function (resolve, reject) {
      // $api.apiPost('/logout', {})
      //   .then((res) => {
      $auth.remove();
      return resolve();
      // })
      // .catch(reject);
    });
  };
};
'use strict';

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

angular.module('MyMoneyWebui.Api').factory('$signup', dsSignupFactory);

dsSignupFactory.$inject = ['$auth', '$api'];
function dsSignupFactory($auth, $api) {
  return function (Email, NewPassword) {
    return new Promise(function (resolve, reject) {
      $api.apiPost('/signups', {
        Email: Email,
        NewPassword: NewPassword
      }).then(function (res) {
        if (202 === res.status) {
          return resolve();
        }
        reject(new Error(res.data.Error || "UNKNOWN_ERROR_408392"));
      }).catch(function (res) {
        if (400 === res.status) {
          return reject(res.data.ErrorMsg);
        }
        console.log(res);
        reject(new Error("UNKNOWN_ERROR_408393"));
      });
    });
  };
};
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

angular.module('MyMoneyWebui.Api').factory('Token', TokenFactory);

TokenFactory.$inject = [];
function TokenFactory() {
  var Token = function Token(key) {
    _classCallCheck(this, Token);

    var keyParts = key.split(/\//g);

    this.Key = key;
    this.Id = keyParts[0];
    this.UserId = keyParts[1];
    this.Created = keyParts[2];
  };

  return Token;
}
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

angular.module('MyMoneyWebui.Api').factory('User', UserFactory);

UserFactory.$inject = [];
function UserFactory() {
  var User = function User(Id) {
    _classCallCheck(this, User);

    this.Id = Id;
    this.Login = null;

    this.Apps = [];
  };

  return User;
}
'use strict';

angular.module('MyMoneyWebui').run(['$templateCache', function ($templateCache) {
  $templateCache.put('modules/anon/html/login.html', '<div id="login"\n  layout="column"\n  layout-align="center center"\n  layout-fill>\n  <div class="login-form form-wrapper"\n    layout="column"\n    md-whiteframe="12dp">\n\n    <header layout="row"\n      layout-align="start center">\n\n      <img class="app-logo"\n        src="logo.png" />\n\n      <div flex layout="column">\n        <span class="md-headline">MyMoney</span>\n        <span class="md-subhead">User Login</span>\n      </div>\n\n    </header>\n\n    <form layout="column"\n      ng-controller="LoginController"\n      ng-submit="onSubmit($event)">\n\n      <div class="login-error"\n        ng-if="error">\n        <strong>Login failed:</strong>\n        {{ error }}\n      </div>\n\n      <md-content layout="column">\n\n        <md-input-container>\n          <label>Username / Email</label>\n          <input ng-model="credentials.Login"\n            ng-minlength="5"\n            required />\n        </md-input-container>\n\n        <md-input-container>\n          <label>Password</label>\n          <input ng-model="credentials.Password"\n            type="password"\n            ng-minlength="7"\n            required />\n        </md-input-container>\n\n      </md-content>\n\n      <div class="submit-row"\n        layout="row"\n        layout-align="end center">\n        <!-- <a class="md-button" href="#">Forgot Password</a> -->\n        <md-button class="md-primary md-raised"\n          type="submit">\n          Login\n        </md-button>\n      </div>\n\n      <md-progress-linear md-mode="indeterminate"\n        ng-if="showProgress"></md-progress-linear>\n\n    </form>\n\n  </div>\n  <div class="new-user-banner"\n    layout="row"\n    layout-align="start center"\n    md-whiteframe="12dp">\n    <strong>New, here?</strong>\n    <span>It\'s free to signup</span>\n\n    <span flex></span>\n\n    <a class="md-button"\n      ui-sref="app.anon.signup">\n      Sign-up\n    </a>\n  </div>\n</div>\n');
  $templateCache.put('modules/anon/html/root.html', '<div ui-view layout layout-fill></div>\n');
  $templateCache.put('modules/anon/html/signup.html', '<div id="signup" layout layout-fill layout-align="center center">\n  <div class="signup-form form-wrapper" layout="column" md-whiteframe="12dp">\n\n    <header layout="row" layout-align="start center">\n\n      <img src="logo.png" class="app-logo" />\n\n      <div flex layout="column">\n        <span class="md-caption">MyMoney</span>\n        <span class="md-headline">User Signup</span>\n      </div>\n\n    </header>\n\n    <form name="signupForm" layout="column" ng-submit="submit($event)"\n      ng-controller="SignupController">\n\n      <md-content layout="column">\n\n        <md-input-container>\n          <label>Email Address</label>\n          <input name="emailAddress"\n            ng-model="newUser.EmailAddress"\n            required\n            type="email"\n            ng-disabled="inputDisabled" />\n          <div ng-messages="signupForm.emailAddress.$error">\n            <div ng-message="required">A valid email address is required.</div>\n          </div>\n        </md-input-container>\n\n        <md-input-container>\n          <label>Password</label>\n          <input name="password"\n            ng-model="newUser.Password"\n            required\n            type="password"\n            ng-pattern="/^.{7,}$/"\n            ng-disabled="inputDisabled" />\n          <div ng-messages="signupForm.password.$error"\n            md-auto-hide="true"\n            multiple>\n            <div ng-message="required">Password is required.</div>\n            <div ng-message="pattern">Password must be at least 7 characters.</div>\n          </div>\n        </md-input-container>\n\n        <md-input-container>\n          <label>Confirm Password</label>\n          <input name="passwordConfirmation"\n            ng-model="passwordConfirmation"\n            ng-disabled="inputDisabled"\n            type="password"\n            must-match="newUser.Password"\n            required />\n          <div ng-messages="signupForm.passwordConfirmation.$error"\n            md-auto-hide="true"\n            multiple>\n            <div ng-message="required">Please re-enter your password.</div>\n            <div ng-message="mustMatch">Passwords must match.</div>\n          </div>\n        </md-input-container>\n\n        <md-input-container>\n          <md-checkbox name="touAccepted"\n            ng-model="touAccepted"\n            aria-label="I have read and agree to the Terms of Use and Privacy Policy"\n            ng-true-value="true"\n            ng-false-value="false"\n            class="md-align-top-left"\n            required\n            flex>\n            I have read and agree to the\n            <a href ng-click="showLegal($event, \'termsOfUse\')">Terms of Use</a>\n            and\n            <a href ng-click="showLegal($event, \'privacyPolicy\')">Privacy Policy</a>\n          </md-checkbox>\n          <div ng-messages="signupForm.touAccepted.$error"\n            md-auto-hide="true">\n            <div ng-message="required">\n              You must agree to the Terms of Service and Privacy Policy before\n              you can create an account\n            </div>\n          </div>\n        </md-input-container>\n\n      </md-content>\n\n      <div class="submit-row" layout="row" layout-align="end center">\n        <a class="md-button"\n          ui-sref="app.anon.login">\n          Back\n        </a>\n        <md-button class="md-primary md-raised" type="submit">\n          Create my account\n        </md-button>\n      </div>\n\n      <md-progress-linear md-mode="indeterminate" ng-if="showProgress"></md-progress-linear>\n\n    </form>\n\n  </div>\n</div>\n');
  $templateCache.put('modules/logbookPage/html/page.html', '<!-- Logbook Page -->\n<div id="LogbookPage"\n  layout="row"\n  flex>\n  <div layout="column"\n    flex>\n\n    <!-- Logbook Header -->\n    <md-toolbar class="page-header md-sticky">\n      <div class="md-toolbar-tools">\n\n        <!-- Logbook Title -->\n        <h1>{{ $logbookPage.logbook.Name }}</h1>\n\n        <span flex></span>\n\n        <!-- Create A New Transaction Button -->\n        <md-button class="md-raised md-primary create-transaction-button"\n          ng-click="$logbookPage.createTransaction()">\n\n          <!-- Icon -->\n          <md-icon class="material-icons">\n            add\n          </md-icon>\n\n          <!-- Text -->\n          <span>Entry</span>\n\n        </md-button>\n\n        <md-menu class="logbook-tools">\n          <!-- trigger -->\n          <md-button class="menu-toggle md-icon-button"\n            aria-label="Open Settings"\n            ng-click="openMenu($mdMenu.open, $event)">\n            <md-icon class="material-icons">\n              settings_cog\n            </md-icon>\n          </md-button>\n          <!-- content -->\n          <md-menu-content width="4">\n            <md-menu-item>\n              <md-button ng-click="$logbookPage.renameLogbook($event)">\n                <md-icon>edit</md-icon>\n                Rename Logbook\n              </md-button>\n            </md-menu-item>\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n              <md-button ng-click="$logbookPage.deleteLogbook($event)">\n                <md-icon>delete</md-icon>\n                Delete Logbook\n              </md-button>\n            </md-menu-item>\n          </md-menu-content>\n        </md-menu>\n\n      </div>\n    </md-toolbar>\n\n    <!-- Logbook Content -->\n    <main>\n\n      <!-- Logbook Transactions Section -->\n      <section class="transactions">\n\n        <!-- Logbook Days -->\n        <ul class="logbook-days">\n\n          <!-- Day -->\n          <li ng-repeat="day in $logbookPage.days | orderBy: \'-date\'">\n            <md-subheader>\n              <span>{{ day.date }}</span>\n            </md-subheader>\n\n            <!-- Logbook Transactions -->\n            <ul class="transactions">\n\n              <!-- Transaction -->\n              <li ng-repeat="transaction in day.transactions | orderBy: \'-Occurred\'"\n                ng-class="{\'credit-transaction\': transaction.Amount > -1, \'debit-transaction\': transaction.Amount < 0}">\n                <a ui-sref="app.user.transactionPage({ transactionId: transaction.Id })"\n                  layout="row">\n                  <span class="transaction-title">{{ transaction.Summary }}</span>\n                  <span flex></span>\n                  <span class="transaction-currency-symbol">{{ $logbookPage.currencySymbol }}</span>\n                  <span class="transaction-amount">{{ $logbookPage.abs(transaction.Amount / $logbookPage.currencyAmountMultiplier) }}</span>\n                  <span class="transaction-type">{{ transaction.Amount > -1 ? \'CR\' : \'DR\' }}</span>\n                </a>\n              </li>\n\n            </ul>\n\n            <footer layout="row"\n              ng-class="{\'credit-day\': day.total > -1, \'debit-day\': day.total < 0}">\n              <span class="total-row-label">Total</span>\n              <span flex></span>\n              <span class="logbook-currency-symbol">\n                {{ $logbookPage.currencySymbol }}\n              </span>\n              <span class="logbook-total">\n                {{ $logbookPage.abs(day.total / $logbookPage.currencyAmountMultiplier) }}\n              </span>\n              <span class="logbook-total-type">\n                {{ day.total > -1 ? \'CR\' : \'DR\' }}\n              </span>\n            </footer>\n          </li>\n\n        </ul>\n\n        <!-- Section Footer -->\n        <footer>\n\n          <!-- Create A New Transaction Button -->\n          <md-button class="md-raised md-primary"\n            ng-click="$logbookPage.createTransaction()">\n\n            <!-- Icon -->\n            <md-icon class="material-icons">\n              create\n            </md-icon>\n\n            <!-- Text -->\n            <span>Create a new transaction</span>\n\n          </md-button>\n\n        </footer>\n\n      </section>\n\n    </main>\n\n  </div>\n</div>\n');
  $templateCache.put('modules/transactionPage/html/page.html', '<!-- Transaction Page -->\n<div id="TransactionPage"\n  layout="row"\n  flex>\n  <div layout="column"\n    flex>\n\n    <!-- Transaction Header -->\n    <md-toolbar class="page-header">\n      <div class="md-toolbar-tools">\n\n        <!-- Back Button -->\n        <md-button class="back-button md-icon-button"\n          ng-click="$transactionPage.navToParent()">\n          <md-icon class="material-icons">\n            chevron_left\n          </md-icon>\n        </md-button>\n\n        <!-- Transaction Title -->\n        <h1>{{ $transactionPage.transaction.Summary }}</h1>\n\n        <span flex></span>\n\n        <md-menu class="transaction-tools">\n          <!-- trigger -->\n          <md-button class="menu-toggle md-icon-button"\n            aria-label="Open Settings"\n            ng-click="openMenu($mdMenu.open, $event)">\n            <md-icon class="material-icons">\n              settings_cog\n            </md-icon>\n          </md-button>\n          <!-- content -->\n          <md-menu-content width="4">\n            <md-menu-item>\n              <md-button ng-click="$transactionPage.changeSummary($event)">\n                <md-icon>edit</md-icon>\n                Change Summary\n              </md-button>\n            </md-menu-item>\n            <md-menu-item>\n              <md-button ng-click="$transactionPage.changeAmount($event)">\n                <md-icon>edit</md-icon>\n                Change Amount\n              </md-button>\n            </md-menu-item>\n            <md-menu-item>\n              <md-button ng-click="$transactionPage.changeOccurred($event)">\n                <md-icon>edit</md-icon>\n                Change Date\n              </md-button>\n            </md-menu-item>\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n              <md-button ng-click="$transactionPage.deleteTransaction($event)">\n                <md-icon>delete</md-icon>\n                Delete Transaction\n              </md-button>\n            </md-menu-item>\n          </md-menu-content>\n        </md-menu>\n\n      </div>\n    </md-toolbar>\n\n    <!-- Transaction Content -->\n    <main layout="column"\n      flex>\n\n      <!-- No Transaction Details Yet ... Section -->\n      <section id="NoTransactionDetails"\n        layout="column"\n        flex>\n        <div class="add-details"\n          layout="column"\n          layout-align="center center"\n          flex>\n          <span flex></span>\n          <span class="placeholder-text">No details yet ...</span>\n          <span flex></span>\n        </div>\n      </section>\n\n    </main>\n\n  </div>\n</div>\n');
  $templateCache.put('modules/user/html/root.html', '<md-sidenav class="md-sidenav-left md-whiteframe-z2"\n  layout="column"\n  md-theme="sidenavTheme"\n  md-component-id="left"\n  md-is-locked-open="$mdMedia(\'gt-md\')">\n\n  <div ng-controller="SidenavController as $sidenav"\n    ng-cloak>\n\n    <header layout="row" layout-align="start center">\n\n      <img src="logo.png" class="app-logo" />\n\n      <div flex layout="column">\n        <span class="md-headline">MyMoney</span>\n        <span class="md-caption">eviratec.software</span>\n      </div>\n\n    </header>\n\n    <md-list>\n      <md-list-item ui-sref="app.user.dashboard"\n        ng-click="toggleSidenav(\'left\')">\n        <md-icon class="material-icons">\n          apps\n        </md-icon>\n        <p>Dashboard</p>\n      </md-list-item>\n\n      <md-divider></md-divider>\n\n      <md-subheader ng-click="showSidenavApps=!showSidenavApps">\n        My Logbooks\n      </md-subheader>\n\n      <md-list-item ui-sref-active="active"\n        ui-sref="app.user.logbookPage({ logbookId: logbook.Id })"\n        ng-repeat="logbook in logbooks | orderBy: \'Name\'"\n        ng-if="showSidenavLogbooks"\n        ng-click="toggleSidenav(\'left\')">\n        <md-icon class="material-icons">\n          account_balance_wallet\n        </md-icon>\n        <p>{{ logbook.Name }}</p>\n      </md-list-item>\n\n      <md-list-item\n        ng-click="createLogbook()"\n        ng-if="showSidenavLogbooks"\n        ng-click="toggleSidenav(\'left\')">\n        <md-icon class="material-icons">\n          create\n        </md-icon>\n        <p>Create a Logbook</p>\n      </md-list-item>\n\n    </md-list>\n  </div>\n</md-sidenav>\n\n<md-progress-linear class="root-progress-bar"\n  md-mode="indeterminate"\n  ng-if="showProgress"></md-progress-linear>\n\n<div class="relative"\n  layout="column"\n  role="main"\n  ng-controller="LayoutController"\n  layout-fill\n  ng-cloak>\n  <md-toolbar id="userToolbar">\n    <div class="md-toolbar-tools">\n\n      <img class="logo"\n        src="logo.png" />\n\n      <h3 class="md-caption"\n        ng-if="$mdMedia(\'gt-xs\')">\n        MyMoney\n      </h3>\n\n      <span flex></span>\n\n      <md-menu class="hide-gt-xs">\n        <!-- trigger -->\n        <md-button class="md-icon-button"\n          aria-label="Open Settings"\n          ng-click="openMenu($mdMenu.open, $event)">\n          <md-icon class="material-icons">\n            person\n          </md-icon>\n          <md-icon class="material-icons">\n            arrow_drop_down\n          </md-icon>\n        </md-button>\n        <!-- content -->\n        <md-menu-content width="4">\n          <md-menu-item>\n              <span class="user-displayname">\n                {{ login }}\n              </span>\n          </md-menu-item>\n          <md-menu-divider></md-menu-divider>\n          <md-menu-item>\n            <md-button ng-click="logout()">\n              <md-icon>power_settings_new</md-icon>\n              Logout\n            </md-button>\n          </md-menu-item>\n        </md-menu-content>\n      </md-menu>\n\n      <md-menu class="hide-xs">\n        <!-- trigger -->\n        <md-button\n          aria-label="Open Settings"\n          ng-click="openMenu($mdMenu.open, $event)">\n          <md-icon class="material-icons">\n            person\n          </md-icon>\n          <span class="user-displayname md-caption">\n            {{ login }}\n          </span>\n          <md-icon class="material-icons">\n            arrow_drop_down\n          </md-icon>\n        </md-button>\n        <!-- content -->\n        <md-menu-content width="4">\n          <!-- <md-menu-item>\n            <md-button ng-click="changeProfile($event)">\n              <md-icon>face</md-icon>\n              Profile\n            </md-button>\n          </md-menu-item>\n          <md-menu-item>\n            <md-button ng-click="changePassword()">\n              <md-icon>lock</md-icon>\n              Password\n            </md-button>\n          </md-menu-item>\n          <md-menu-divider></md-menu-divider> -->\n          <md-menu-item>\n            <md-button ng-click="logout()">\n              <md-icon>power_settings_new</md-icon>\n              Logout\n            </md-button>\n          </md-menu-item>\n        </md-menu-content>\n      </md-menu>\n\n      <md-button class="md-icon-button"\n        aria-label="Menu"\n        ng-click="toggleSidenav(\'left\')"\n        hide-gt-md>\n        <md-icon class="material-icons">\n          menu\n        </md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-content class="ds-main-content"\n    layout="column"\n    md-scroll-y\n    flex>\n    <div layout="column"\n      layout-fill\n      ui-view>\n    </div>\n  </md-content>\n\n</div>\n');
  $templateCache.put('modules/userDashboard/html/dashboard.html', '<div id="UserDashboard"\n  layout="row"\n  flex>\n\n  <div class="user-dashboard"\n    style="margin: 8px;padding:8px;"\n    flex>\n\n    <div layout="column">\n      <div style="border-bottom: 1px solid rgba(255,255,255, 0.12);margin:24px 8px 8px;padding:0 8px;height:49px;"\n        layout="row"\n        layout-align="start center">\n        <md-card-header-text>\n          <span class="md-headline">\n            My Logbooks\n          </span>\n        </md-card-header-text>\n      </div>\n\n      <div layout="row"\n        layout-xs="column"\n        layout-wrap>\n        <div flex-gt-xs="33"\n          ng-repeat="logbook in logbooks | orderBy: \'Name\'">\n          <md-card>\n            <md-card-header ui-sref="app.user.logbookPage({ logbookId: logbook.Id })">\n              <md-card-avatar>\n                <md-icon class="material-icons">\n                  account_balance_wallet\n                </md-icon>\n              </md-card-avatar>\n              <md-card-header-text flex>\n                <span class="md-title">{{ logbook.Name }}</span>\n                <span class="md-subhead">&nbsp;</span>\n              </md-card-header-text>\n              <span class="logbook-balance-currency-symbol">\n                {{ logbook.Balance > -1 ? \'CR\' : \'DR\' }}\n                {{ currencySymbols[logbook.Currency] }}\n              </span>\n              <span class="logbook-balance">\n                {{ abs(logbook.Balance) / pow(10, currencyDecimalPlaces[logbook.Currency]) | currency : \'\' : 2 }}\n              </span>\n            </md-card-header>\n            <md-divider></md-divider>\n            <md-card-actions layout="row"\n              layout-align="end center">\n              <md-button class="md-primary"\n                ui-sref="app.user.logbookPage({ logbookId: logbook.Id })">\n                <md-icon class="material-icons">\n                  edit\n                </md-icon>\n                Manage Transactions\n              </md-button>\n            </md-card-actions>\n          </md-card>\n        </div>\n        <div flex-gt-xs="33">\n          <div class="create-logbook-card"\n            layout="column"\n            layout-align="center center">\n            <span>New logbook?</span>\n            <md-button class="md-raised md-primary"\n              ng-click="createLogbook()">\n              <md-icon class="material-icons">\n                create\n              </md-icon>\n              Create a new logbook\n            </md-button>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n');
  $templateCache.put('modules/app/html/app.html', '<div ui-view layout layout-fill></div>\n');
  $templateCache.put('modules/logbookPage/html/dialogs/createTransaction.html', '<md-dialog id="Dialog_CreateTransaction"\n  aria-label="Create Transaction Form">\n  <form name="createTransactionForm"\n    ng-cloak>\n    <md-toolbar>\n      <div class="md-toolbar-tools">\n        <h2>Create Transaction</h2>\n        <span flex></span>\n        <md-button class="md-icon-button"\n          ng-click="cancel()">\n          <md-icon class="material-icons"\n            aria-label="Close dialog">\n            close\n          </md-icon>\n        </md-button>\n      </div>\n    </md-toolbar>\n\n    <md-dialog-content>\n      <div class="md-dialog-content"\n        layout="column">\n        <md-input-container>\n          <label>Summary</label>\n          <input name="transactionSummary"\n            ng-model="$data.Summary"\n            md-autofocus>\n        </md-input-container>\n\n        <div layout="row"\n          layout-xs="row"\n          layout-align="start start"\n          layout-align-xs="start stretch">\n          <md-input-container flex>\n            <label>Amount ({{ currencySymbol }})</label>\n            <input name="transactionAmount"\n              ng-model="$data.Amount">\n          </md-input-container>\n\n          <md-input-container>\n            <label>Type</label>\n            <md-select name="transactionType"\n              ng-model="$data.Type"\n              required>\n              <md-option value="credit">Credit</md-option>\n              <md-option value="debit">Debit</md-option>\n            </md-select>\n            <div class="errors"\n              ng-messages="createTransactionForm.transactionType.$error">\n              <div ng-message="required">Required</div>\n            </div>\n          </md-input-container>\n        </div>\n\n        <md-input-container>\n          <label>Date Occurred</label>\n          <input name="transactionOccurred"\n            ng-model="$data.Occurred"\n            type="datetime-local">\n        </md-input-container>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout="row">\n      <span flex></span>\n      <md-button ng-click="cancel()">\n        Cancel\n      </md-button>\n      <md-button class="md-primary"\n        ng-click="answer()">\n        Create Transaction\n      </md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n');
  $templateCache.put('modules/transactionPage/html/dialogs/changeOccurred.html', '<md-dialog id="Dialog_ChangeTransactionOccurred"\n  aria-label="Change Transaction Occurred Form">\n  <form name="changeTransactionOccurredForm"\n    ng-cloak>\n    <md-toolbar>\n      <div class="md-toolbar-tools">\n        <h2>Change Transaction Occurred</h2>\n        <span flex></span>\n        <md-button class="md-icon-button"\n          ng-click="cancel()">\n          <md-icon class="material-icons"\n            aria-label="Close dialog">\n            close\n          </md-icon>\n        </md-button>\n      </div>\n    </md-toolbar>\n\n    <md-dialog-content>\n      <div class="md-dialog-content"\n        layout="column">\n        <md-input-container>\n          <label>Occurred</label>\n          <input name="transactionOccurred"\n            ng-model="$data.Occurred"\n            type="datetime-local"\n            md-autofocus>\n        </md-input-container>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout="row">\n      <span flex></span>\n      <md-button ng-click="cancel()">\n        Cancel\n      </md-button>\n      <md-button class="md-primary"\n        ng-click="answer()">\n        Save\n      </md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n');
  $templateCache.put('modules/app/html/dialog/privacyPolicy.html', '<md-dialog id="Dialog_PrivacyPolicy"\n  aria-label="Privacy Policy">\n  <form ng-cloak>\n    <md-toolbar>\n      <div class="md-toolbar-tools">\n        <h2>MoneyLog Privacy Policy</h2>\n        <span flex></span>\n        <md-button class="md-icon-button" ng-click="cancel()">\n          <md-icon class="material-icons" aria-label="Close dialog">\n            close\n          </md-icon>\n        </md-button>\n      </div>\n    </md-toolbar>\n\n    <md-dialog-content>\n      <div class="legal-text">\n        <h1>Privacy Policy</h1>\n\n        <p>Last updated: July 28, 2017</p>\n\n        <p>CALLAN MILNE ("us", "we", or "our") operates the https://my.moneylog.xyz website (the "Service").</p>\n\n        <p>This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.</p>\n\n        <p>We will not use or share your information with anyone except as described in this Privacy Policy.</p>\n\n        <p>We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at http://www.mymoney.xyz</p>\n\n\n\n        <h2>Information Collection And Use</h2>\n\n        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, other information ("Personal Information").</p>\n\n        <p>The purpose for which we collect personal information is to provide you with the best service experience possible on the Service and for our internal business purposes that form part of normal business practices. Some provision of personal information is optional. However, if you do not provide us with certain types of personal information, you may be unable to enjoy the full functionality of the Service.</p>\n\n\n        <h2>Log Data</h2>\n\n        <p>We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer\'s Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>\n\n        <p>In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this type of information in order to increase our Service\'s functionality. These third party service providers have their own privacy policies addressing how they use such information.</p>\n\n\n\n\n        <h2>Cookies</h2>\n\n        <p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer\'s hard drive.</p>\n\n        <p>We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>\n\n        <p>We send a session cookie to your computer when you log in to your User account. This type of cookie helps if you visit multiple pages on the Service during the same session, so that you don\'t need to enter your password on each page. Once you log out or close your browser, this cookie expires.</p>\n\n        <p>We also use longer-lasting cookies for other purposes such as to display your Content and account information. We encode our cookie so that only we can interpret the information stored in them. Users always have the option of disabling cookies via their browser preferences. If you disable cookies on your browser, please note that some parts of our Service may not function as effectively or may be considerably slower.</p>\n\n\n\n\n\n\n        <h2>Service Providers</h2>\n\n        <p>We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>\n\n        <p>These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>\n\n\n\n\n        <h2>Compliance With Laws</h2>\n\n        <p>We may disclose personal information in special situations where we have reason to believe that doing so is necessary to identify, contact or bring legal action against anyone damaging, injuring or interfering (intentionally or unintentionally) with our rights or property, users or anyone else who could be harmed by such activities. <p>We will disclose your Personal Information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement or to protect the security or integrity of our Service.</p>\n\n\n        <h2>Business Transaction</h2>\n\n        <p>In the event that we sell or buy businesses or their assets, or engage in transfers, acquisitions, mergers, restructurings, changes of control and other similar transactions, customer or user information is generally one of the transferable business assets. Thus, your personal information may be subject to such a transfer. In the unlikely event of insolvency, personal information may be transferred to a trustee or debtor in possession and then to a subsequent purchaser.</p>\n\n\n        <h2>Security</h2>\n\n        <p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>\n\n\n        <h2>International Transfer</h2>\n\n        <p>Your information, including Personal Information, may be transferred to \u2014 and maintained on \u2014 computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>\n\n        <p>If you are located outside Australia and choose to provide information to us, please note that we transfer the information, including Personal Information, to Australia and process it there.</p>\n\n        <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>\n\n\n        <h2>Access and Correction</h2>\n\n        <p>Australian Privacy Principle 6 of the Privacy Act 1988 (Cth) allows you to get access to, and correct, the personal information we hold about you in certain circumstances. If you would like to obtain such access, please contact us on the details set out above.</p>\n\n        <p>Please note that the access and correction requirements under this Privacy Policy operates alongside and do not replace other informal or legal procedures by which an individual can be provided access to, or correction of, their personal information, including the requirements under the Freedom of Information Act 1982 (Cth).</p>\n\n\n        <h2>Complaints</h2>\n\n        <p>Australian Privacy Principle 1 of the Privacy Act 1988 (Cth) allows you to make a complaint about any alleged breaches of privacy. In order to lodge a complaint with us, please contact us using the details above with the following information:</p>\n\n        <ul>\n            <li>\n                <p>Your name and address;</p>\n            </li>\n            <li>\n                <p>Details of the alleged breach of privacy; and</p>\n            </li>\n            <li>\n                <p>URL link to the alleged breach of privacy (if applicable).</p>\n            </li>\n        </ul>\n\n        <p>Please allow us 30 days to investigate your complaint, after which we will contact you immediately to resolve the issue.</p>\n\n\n        <h2>Retention of Information</h2>\n\n        <p>We retain information for as long as required, allowed or we believe it useful, but do not undertake retention obligations. We may dispose of information in our discretion without notice, subject to applicable law that specifically requires the handling or retention of information. You must keep your own, separate back-up records.</p>\n\n\n        <h2>Links To Other Sites</h2>\n\n        <p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party\'s site. We strongly advise you to review the Privacy Policy of every site you visit.</p>\n\n        <p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>\n\n\n        <h2>Children\'s Privacy</h2>\n\n        <p>Our Service does not address anyone under the age of 18 ("Children").</p>\n\n        <p>We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from children under 18 without verification of parental consent, we take steps to remove that information from our servers or replace it with the Personal Information of the Children\u2019s parent or guardian.</p>\n\n\n        <h2>Changes To This Privacy Policy</h2>\n\n        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>\n\n        <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>\n\n        <p>If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>\n\n\n        <h2>Consent</h2>\n\n        <p>You warrant that you are able to give consents under Australian Law or, in the event that you do not have the capacity to give consent, you warrant that your guardian or attorney is able to give any consent required under this Privacy Policy on your behalf.</p>\n\n        <p>You hereby expressly and voluntarily grant your informed consent to us to deal with your personal information in accordance with the terms and conditions of this Privacy Policy. Should you retract your consent, please contact us. If you retract your consent, you acknowledge and agree that failure to provide certain types of personal information may not give you access to the full functionality of the Service.</p>\n\n\n        <h2>Contact Us</h2>\n\n        <p>If you have any questions about this Privacy Policy, please <a href="mailto:info@moneylog.xyz">contact us</a>.</p>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout="row">\n      <span flex></span>\n      <md-button class="md-primary" ng-click="cancel()">\n        Close\n      </md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n');
  $templateCache.put('modules/app/html/dialog/termsOfUse.html', '<md-dialog id="Dialog_TermsOfUse"\n  aria-label="Terms of Use">\n  <form ng-cloak>\n    <md-toolbar>\n      <div class="md-toolbar-tools">\n        <h2>MoneyLog Terms of Use</h2>\n        <span flex></span>\n        <md-button class="md-icon-button" ng-click="cancel()">\n          <md-icon class="material-icons" aria-label="Close dialog">\n            close\n          </md-icon>\n        </md-button>\n      </div>\n    </md-toolbar>\n\n    <md-dialog-content>\n      <div class="legal-text">\n        <h1>Terms of Use</h1>\n\n\n        <p>Last updated: July 28, 2017</p>\n\n\n        <p>Please read these Terms of Use ("Terms", "Terms of Use") carefully before using the https://my.moneylog.xyz website (the "Service") operated by CALLAN MILNE ("us", "we", or "our").</p>\n\n        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service. You warrant that you are at least 18-years-old and you are legally capable of entering into binding contracts. If you are under 18-years-old, you warrant that you have obtained consent from your parent or guardian and they agree to be bound by these Terms on your behalf.</p>\n\n        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>\n\n\n\n\n\n\n        <h2>Content</h2>\n\n        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>\n\n        <p>By posting Content to the Service, you grant us the right and license to use, modify, perform, display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.</p>\n\n        <p>You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person. Further, you warrant that: (i) the Content will not cause you or us to breach any law, regulation, rule, code or other legal obligation; (ii) the Content will not or could not be reasonably considered to be obscene, inappropriate, defamatory, disparaging, indecent, seditious, offensive, pornographic, threatening, abusive, liable to incite racial hatred, discriminatory, blasphemous, in breach of confidence or in breach of privacy; (iii) the Content will not be unsolicited, undisclosed or unauthorised advertising; (iv) the Content does not contain software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software, hardware or telecommunications equipment; and (v): the Content does not bring us or the Service into disrepute.</p>\n\n        <p>You agree to keep all records necessary to establish that your Content does not violate any of the requirements this clause and make such records available upon our reasonable request.</p>\n\n        <p>We are under no obligation to regularly monitor the accuracy or reliability of your Content incorporated into the Service. We reserve the right to modify or remove any Content at any time.</p>\n\n\n\n        <h2>Accounts</h2>\n\n        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>\n\n        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>\n\n        <p>You agree not to disclose your password to any third party. You agree to be fully responsible for activities that relate to your account or your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>\n\n\n\n\n\n\n\n        <h2>Links To Other Web Sites</h2>\n\n        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by CALLAN MILNE.</p>\n\n        <p>CALLAN MILNE has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that CALLAN MILNE shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>\n\n        <p>We only provide links to external websites as a convenience, and the inclusion of such a link to external websites do not imply our endorsement of those websites. You acknowledge and agree that when you access other websites on the Internet, you do so at your own risk.</p>\n\n        <p>We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.</p>\n\n\n        <h2>Termination</h2>\n\n        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>\n\n        <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>\n\n        <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>\n\n        <p>We shall not be liable to you or any third party for any claims or damages arising out of any termination or suspension or any other actions taken by us in connection therewith.</p>\n\n        <p>If applicable law requires us to provide notice of termination or cancellation, we may give prior or subsequent notice by posting it on the Service or by sending a communication to any address (email or otherwise) that we have for you in our records.</p>\n\n\n        <h2>Indemnification</h2>\n\n        <p>As a condition of your access to and use of the Service, you agree to indemnify us and our successors and assigns for all damages, costs, expenses and other liabilities, including but not limited to legal fees and expenses, relating to any claim arising out of or related to your access to and use of the Servuce or your breach of these Terms and any applicable law or the rights of another person or party.</p>\n\n        <p>This indemnification section survives the expiration of your registration, and applies to claims arising both before and after the registration ends.</p>\n\n\n        <h2>Limitation Of Liability</h2>\n\n        <p>You agree that we shall not be liable for any damages suffered as a result of using the Service, copying, distributing, or downloading Content from the Service.</p>\n\n        <p>In no event shall we be liable for any indirect, punitive, special, incidental or consequential damage (including loss of business, revenue, profits, use, privacy, data, goodwill or other economic advantage) however it arises, whether for breach of contract or in tort, even if it has been previously advised of the possibility of such damage.</p>\n\n\n        <p>You have sole responsibility for adequate security protection and backup of data and/or equipment used in connection with your usage of the Service and will not make a claim against for lost data, re-run time, inaccurate instruction, work delays or lost profits resulting from the use of the Service. You must not assign or otherwise dispose of your account to any other person.</p>\n\n        <p>Without limiting the foregoing, in no event will our aggregate liability to you exceed, in total, the amounts paid by you to us.</p>\n\n\n        <h2>Disclaimer</h2>\n\n        <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>\n\n        <p>CALLAN MILNE its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>\n\n        <p>This disclaimer of liability applies to any damages or injury caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft, or destruction or unauthorized access or, alteration of or use of record in connection with the use or operation of the Service, whether for breach of contract, tortious behaviour, negligence or any other cause of action.</p>\n\n        <p>We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the content contained on the Service for any purpose. Any reliance you place on such information is therefore strictly at your own risk. We disclaim any express or implied warranty representation or guarantee as to the effectiveness or profitability of the Service or that the operation of our Service will be uninterrupted or error-free. We are not liable for the consequences of any interruptions or error in the Service.</p>\n\n\n        <h2>Exclusions</h2>\n\n        <p>Some jurisdictions do not allow the exclusion of certain warranties or the exclusion or limitation of liability for consequential or incidental damages, so the limitations above may not apply to you.</p>\n\n\n        <h2>Governing Law</h2>\n\n        <p>These Terms shall be governed and construed in accordance with the laws of Victoria, Australia, without regard to its conflict of law provisions.</p>\n\n        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>\n\n\n        <h2>Changes</h2>\n\n        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.</p>\n\n        <p>It is your sole responsibility to periodically check these Terms for any changes. If you do not agree with any of the changes to these Terms, it is your sole responsibility to stop using the Service. Your continued use of the Service will be deemed as your acceptance thereof.</p>\n\n\n        <h2>Contact Us</h2>\n\n        <p>If you have any questions about these Terms, please <a href="mailto:info@moneylog.xyz">contact us</a>.</p>\n      </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout="row">\n      <span flex></span>\n      <md-button class="md-primary" ng-click="cancel()">\n        Close\n      </md-button>\n    </md-dialog-actions>\n  </form>\n</md-dialog>\n');
}]);
//# sourceMappingURL=app.js.map
