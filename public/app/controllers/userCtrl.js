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

});

