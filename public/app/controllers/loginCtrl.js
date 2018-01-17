angular.module('loginController', ['authServices'])

.controller('loginCtrl', function(Auth, $timeout, $location) {

    var app = this;

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
                }, 2000);
            } else {
                // Creating Error Msg
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };

});



