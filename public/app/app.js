angular.module('userApp',['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'loginController', 'authServices'])

// Configuring the application to intercept all HTTP requests with AuthInterceptors which assigns the token to the header.
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptors');
	});

