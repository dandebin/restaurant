URL_DEV='http://localhost:1779/';
URL_PRO='http://112.64.131.222/IngPalService/api/';
ULR = URL_DEV;
app.constant('config', {
	serviceUrl: ULR,
});

app.config( ['$compileProvider', function( $compileProvider ){   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|#|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
}]);

$.ajaxSetup({
	beforeSend:function(request){
		var user = window.localStorage.getItem('userInfo')||{};
		var token= $.parseJSON(user).userToken||'';
		request.setRequestHeader('Token', token);
		request.setRequestHeader('Lang',window.localStorage.lang);
		
		$('#loading').show();
	},
	complete:function(request, status){
		$('#loading').hide();
	}
});
/*
app.provider('userInfo', function($localStorage){
	this.$get=function(){
		return $localStorage.$default({
			userId:0,
			userName:'',
			roleId:0,
			storeId:0
		})
	}
});
*/