var app = angular.module('appRoutes',['ngRoute'])

	.config(function($routeProvider, $locationProvider) {

		$routeProvider

			.when('/', {
				templateUrl: 'app/views/pages/home.html'
			})

			.when('/about',{
				templateUrl: 'app/views/pages/about.html'
			})

			.when('/register', {
				templateUrl: 'app/views/pages/users/register.html',
				controller: 'regCtrl',
				controllerAs: 'register',
				// The user can go to this route if they have not been authenticated.
				authenticated: false
			})

			.when('/login',{
				templateUrl: 'app/views/pages/users/login.html',
				authenticated: false
			})

			.when('/logout',{
				templateUrl: 'app/views/pages/users/logout.html',
				authenticated: true
			})

			.when('/profile',{
				templateUrl: 'app/views/pages/users/profile.html',
				authenticated: true
			})

			.when('/facebook/:token',{
				templateUrl: 'app/views/pages/users/social/social.html',
				controller: 'facebookCtrl',
				controllerAs: 'facebook',
				// Won't need this after you have logged in.
				authenticated: false
			})

			.when('/facebookerror',{
				templateUrl: 'app/views/pages/users/login.html',
				controller: 'facebookCtrl',
				controllerAs: 'facebook',
				authenticated: false
			})

			.when('/twitter/:token',{
				templateUrl: 'app/views/pages/users/social/social.html',
				controller: 'twitterCtrl',
				controllerAs: 'twitter',
				authenticated: false
			})

			.when('/twittererror',{
				templateUrl: 'app/views/pages/users/login.html',
				controller: 'twitterCtrl',
				controllerAs: 'twitter',
				authenticated: false
			})

			.when('/google/:token',{
				templateUrl: 'app/views/pages/users/social/social.html',
				controller: 'twitterCtrl',
				controllerAs: 'twitter',
				authenticated: false
			})

			.when('/googleerror',{
				templateUrl: 'app/views/pages/users/login.html',
				controller: 'googleCtrl',
				controllerAs: 'google',
				authenticated: false
			})

			.otherwise({ redirectTo: '/'});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		// If authenticated is true then we prevent the user from going to that page/route if they are not logged in.
		if (next.$$route.authenticated === true) {
			if(!Auth.isLoggedIn()) {
				// Prevent the user from going to the default route.
				event.preventDefault();
				// Send user back to home page.
				$location.path('/');
			}
		} else if (next.$$route.authenticated === false) {
			if(Auth.isLoggedIn()) {
				// Prevent the user from going to the default route.
				event.preventDefault();
				// Send user back to home page.
				$location.path('/profile');
			}
		}
	});
}]);




