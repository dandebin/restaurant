var app = angular.module('app');

app.config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang || 'en';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '../i18n/',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy(null);
}]);

/*
app.controller('LanguageSwitchingCtrl', ['$scope', '$translate',
	function (scope, $translate) {
	    scope.switching = function (lang) {
	        $translate.use(lang);
	        window.localStorage.lang = lang;
	        scope.cur_lang = $translate.use();
	        //window.location.reload();
	    };
	}]);
*/
app.controller('loginAdminCtrl', function ($scope, $translate, service, $localStorage,config) {
    $scope.errMsg = '';
    $scope.cur_lang=window.localStorage.lang;

    $scope.init=function(){
        //remove cache
        service.saveUserInLocale({});
        $scope.onNewDCode();
    }

    $scope.onNewDCode=function(){
        var url=config.serviceUrl+'Login/VerifyImage?r='+Math.random();
        $('#VerifyImage').attr("src", url);
    }

    //$scope.login_title=$translate.instant('100001');   
    $scope.switching = function (lang) {
        $translate.use(lang);
        window.localStorage.lang = lang;
        $scope.cur_lang = lang;
        $scope.errMsg='';
        $('.alert-error').hide();
        //window.location.reload();
    };

    $scope.login = function () {
        service.login({ name: $scope.user, password: $scope.password }, function (response) {
            result=response.childNodes[0].innerHTML;
            if (result=='true') {
                service.saveUserInLocale({userName: $scope.user,roleId:1});
                location.href ='../index.html#/main/welcome?v='+new Date().toTimeString();;
            } else {
                $scope.errMsg = '登录失败';
                $('.alert-error', $('.login-form')).show();
            }
        });
    };

    $scope.postLogin=function(userInfo){
        $('.alert-error', $('.login-form')).hide();
        service.saveUserInLocale(userInfo);
        
        //1   系统管理员   Administrator
        //2   系统操作员   Operator
        //3   审批员 Approver
        //4   普通商户    Merchant
        var urlDic=['../index.html#/main/welcome'
        , '../index.html#/main/dashboard'
        , '../index.html#/rate/change_request'
        , '../index.html#/rate/change_approve'
        , '../index.html#/main/welcome'
         ];
        location.href = urlDic[userInfo.roleId] || '../index.html#/main/welcome';
    }

    $scope.init();
});

app.controller('loginMerchantCtrl', function ($scope, $translate, service, $localStorage,config) {
    $scope.errMsg = '';
    $scope.cur_lang=window.localStorage.lang;
    
    $scope.init=function(){
        //remove cache
        service.saveUserInLocale({});
        $scope.onNewDCode();
    }

    $scope.onNewDCode=function(){
        var url=config.serviceUrl+'Login/VerifyImage?r='+Math.random();
        $('#VerifyImage').attr("src", url);
    }

    //$scope.login_title=$translate.instant('100001');   
    $scope.switching = function (lang) {
        $translate.use(lang);
        window.localStorage.lang = lang;
        $scope.cur_lang = lang;
        //window.location.reload();
    };

    $scope.login = function () {
        service.login({ 
            dynamiccode: $scope.dynamiccode, 
            storeDesc: $scope.storeDesc,
            userName: $scope.user, 
            password: $scope.password }, function (response) {
            if (response.IsSuccess) {
                var data = response.Results;
                var userInfo = {
                    userName: data.UserName,
                    roleId: data.RoleId,
                    userId: data.UserId,
                    userToken: data.UserToken,
                    storeId:data.StoreId
                };
                $scope.postLogin(userInfo);
            } else {
                $scope.errMsg = response.ErrorMessage;
                $('.alert-error', $('.login-form')).show();
                document.getElementById('VerifyImage').src = service.url + 'Login/VerifyImage?r=' + Math.random();
            }
        });
    };

    $scope.postLogin=function(userInfo){
        $('.alert-error', $('.login-form')).hide();
        service.saveUserInLocale(userInfo);
        
        //1   系统管理员   Administrator
        //2   系统操作员   Operator
        //3   审批员 Approver
        //4   普通商户    Merchant
        var urlDic=['../index.html#/main/welcome'
        , '../index.html#/main/dashboard'
        , '../index.html#/rate/change_request'
        , '../index.html#/rate/change_approve'
        , '../index.html#/store/basic_info'
         ];
        location.href = urlDic[userInfo.roleId]||'../index.html#/main/welcome';
    }

    $scope.init();
});