	app.directive('sidebar', function() {
				    return {
				        restrict: 'AE',
				        templateUrl: 'shared/template/sidebar.html',
				        replace: true,
				        //template: '<h3>Hello World!!</h3>'
				    };
	});

	app.directive('headerx', function() {
				    return {
				        restrict: 'AE',
				        templateUrl: 'shared/template/head.html',
				        replace: true,
				        //template: '<h3>Hello World!!</h3>'
				    };
	});

	app.directive('footerx', function() {
				    return {
				        restrict: 'AE',
				        templateUrl: 'shared/template/foot.html',
				        replace: true,
				        //template: '<h3>Hello World!!</h3>'
				    };
	});

