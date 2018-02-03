angular.module('authServices', [])

    // Passing AuthToken into the controller
    .factory('Auth', function($http, AuthToken) {

        authFactory = {};

        authFactory.login = function(loginData) {
            // Everytime the user is logged in it returns the user data including the token
            return $http.post('/api/authenticate', loginData).then(function(data) {
                // Data.data.token picks just the token out of the user data acquired when logged in.
                AuthToken.setToken(data.data.token);
                return data;
            });
        };

        // Custom function that tells us if the user is logged in - Auth.isLoggedIn();
        authFactory.isLoggedIn = function() {
          if(AuthToken.getToken()) {
              return true;
          }  else {
              return false;
          }
        };

        //Saving the token locally when using facebook login. - Auth.facebook(token);
        authFactory.facebook = function(token) {
            AuthToken.setToken(token);
        };

        // Function to get the user from the token. - Auth.getUser();
        authFactory.getUser = function() {
          // Use the getToken function from AuthToken factory.
          if (AuthToken.getToken()) {
              return $http.post('/api/currentUser');
          }  else {
              // Rejecting the request
              $q.reject({message: 'User has no token'});
          }
        };

        //Auth.logout
        authFactory.logout = function() {
            AuthToken.setToken();
        };

        return authFactory;
    })

    // Every time this is called it will save a token to the users browser. Passing $window into the factory.
    .factory('AuthToken', function($window) {
       var authTokenFactory = {};

       // Sets the token to the local storage or removes it - AuthToken.setToken(token);
       authTokenFactory.setToken = function(token){
           if(token) {
               $window.localStorage.setItem('token', token);
           } else {
               $window.localStorage.removeItem('token');
           }
       };

       // getToken going to reach into local storage and get the token - AuthToken.getToken();
       authTokenFactory.getToken = function () {
         return $window.localStorage.getItem('token');
       };

       return authTokenFactory;
    })

    // Need a way to attach a token to every request
    .factory('AuthInterceptors', function(AuthToken) {

        // Creating object.
        var authInterceptorsFactory = {};

        authInterceptorsFactory.request = function(config) {

            // Getting the token if it exists
            var token = AuthToken.getToken();

            // If token exists assign it to the headers and we will now be able to grab it.
            if (token) config.headers['x-access-token'] = token;

            return config

        };


        // Returning object.
        return authInterceptorsFactory;

    });
