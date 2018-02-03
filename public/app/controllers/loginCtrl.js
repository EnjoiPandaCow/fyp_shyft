angular.module('loginController', ['authServices'])

.controller('loginCtrl', function(Auth, $timeout, $location, $rootScope) {
    var app = this;

    // Going to hide the HTML until this becomes true to hide the angular.
    app.loadme=false;

    // Anytime a route changes this invokes everything within the brackets.
    $rootScope.$on('$routeChangeStart', function() {
        // When the page loads we invoke the isLoggedIn function it gets the token and if it is there it returns true.
        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            // If the user is logging in then get that current user.
            Auth.getUser().then(function(data) {
                app.username = data.data.username;
                app.useremail = data.data.email;
                app.loadme=true;
            });
        } else {
            app.isLoggedIn = false;
            app.username = '';
            app.loadme=true;
        }
    });

    this.doLogin = function(loginData) {
        app.loading = true;
        app.errorMsg = false;

        Auth.login(app.loginData).then(function(data) {
            if (data.data.success){
                app.loading = false;
                // Create Success Msg
                app.successMsg = data.data.message + ' Redirecting.';
                // Redirect to Home Page
                $timeout(function() {
                    $location.path('/about');
                    // Removing the login data and the success message from the login page when someone logs in.
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
            } else {
                // Creating Error Msg
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

    // User presses log out and uses Auth.logout to remove the token.
    this.logout = function () {
        Auth.logout();
        // Redirecting the user to the logout page
        $location.path('/logout');
        // Redirecting the user back to the home page.
        $timeout(function() {
            $location.path('/');
        }, 2000);
    };
});



