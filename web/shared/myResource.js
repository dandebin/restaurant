/*
var app=angular.module('app', ['ngResource']);
app.factory('myResource', function($resource, config){
	return function(api){
		var server= config.serviceUrl+api;
		return $resource(server+action, {}, 
			{
				get:{
					method:'GET'
				},
				post:{
					method:'POST'
				},
			});
	};
});
*/