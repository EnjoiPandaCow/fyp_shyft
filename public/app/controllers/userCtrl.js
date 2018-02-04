angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function($http, $location, $timeout, User) {

        var app = this;

        this.regUser = function(regData) {
            app.loading = true;
            app.errorMsg = false;

            User.create(app.regData).then(function(data) {
                if (data.data.success){
                    app.loading = false;
                    // Create Success Msg
                    app.successMsg = data.data.message + ' Redirecting.';
                    // Redirect to Home Page
                    $timeout(function() {
                        $location.path('/');
                    }, 2000);
                } else {
                    // Creating Error Msg
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        };
    })

    .controller('facebookCtrl', function($routeParams, $location, Auth, $window) {
        var app = this;

        if ($window.location.pathname === '/facebookerror') {
            app.errorMsg = 'Facebook e-mail not found in database.';
        } else {
            Auth.facebook($routeParams.token);
            // Redirecting user.
            $location.path('/');
        }
    })

    .controller('twitterCtrl', function($routeParams, $location, Auth, $window) {
        var app = this;

        if ($window.location.pathname === '/twittererror') {
            app.errorMsg = 'Twitter e-mail not found in database.';
        } else {
            Auth.facebook($routeParams.token);
            // Redirecting user.
            $location.path('/');
        }
    })

    .controller('googleCtrl', function($routeParams, $location, Auth, $window) {
        var app = this;

        if ($window.location.pathname === '/googleerror') {
            app.errorMsg = 'Google e-mail not found in database.';
        } else {
            Auth.facebook($routeParams.token);
            // Redirecting user.
            $location.path('/');
        }
    });