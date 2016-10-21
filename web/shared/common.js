app=angular.module('app',['ngRoute', 'pascalprecht.translate','ngRoute', 'ngResource', 'ngTable', 'ngTableExport','ngStorage']);

app.config(['$routeProvider',function ($routeProvider) {
      $routeProvider
      .when('/transaction/current', {
        templateUrl: 'transaction/current.html',
        controller: 'transactionCtr'
      })
      .when('/transaction/history', {
        templateUrl: 'transaction/history.html',
        controller: 'transactionHistoryCtr'
      })
      .when('/transaction/check', {
        templateUrl: 'transaction/check.html',
        controller: 'transactionCtr'
      })
      .when('/main/dashboard', {
        templateUrl: 'main/dashboard.html',
        controller: 'dashboardCtr'
      })
      .when('/rate/change_approve', {
        templateUrl: 'rate/change_approve.html',
        controller: 'rateApproveCtr'
      })
      .when('/rate/change_history', {
        templateUrl: 'rate/change_history.html',
        controller: 'rateHistoryCtr'
      })
      .when('/rate/change_request', {
        templateUrl: 'rate/change_request.html',
        controller: 'changeRequestCtr'
      })
      .when('/store/basic_info', {
        templateUrl: 'store/basic_info.html',
        controller: 'storeInfoCtr'
      })
      .when('/store/withdraw_query', {
        templateUrl: 'store/withdraw_query.html',
        controller: 'withdrawQueryCtr'
      })
      .when('/store/withdraw_request', {
        templateUrl: 'store/withdraw_request.html',
        controller: 'withdrawRequestCtr'
      })
      .when('/store/add', {
        templateUrl: 'store/store_add.html',
        controller: 'storeAddCtr'
      })
      .when('/store/edit', {
        templateUrl: 'store/store_edit.html',
        controller: 'storeEditCtr'
      })
      .when('/user/add', {
        templateUrl: 'user/user_add.html',
        controller: 'addUserCtr'
      })
      .when('/user/edit', {
        templateUrl: 'user/user_edit.html',
        controller: 'editUserCtr'
      })
      .when('/user/password_change', {
        templateUrl: 'user/password_change.html',
        controller: 'passwordChangeCtr'
      })
      .when('/user/user_lock', {
        templateUrl: 'user/user_lock.html',
        controller: 'lockUserCtr'
      })
      .when('/user/permission', {
        templateUrl: 'user/user_permission.html',
        controller: 'userPermissionCtr'
      })
      .when('/refund/add', {
        templateUrl: 'refund/refund_add.html',
        controller: 'addRefundCtr'
      })
      .when('/refund/query', {
        templateUrl: 'refund/refund_query.html',
        controller: 'queryRefundCtr'
      })
      .when('/refund/approve', {
        templateUrl: 'refund/refund_approve.html',
        controller: 'approveRefundCtr'
      })
      .when('/reconcile/query', {
        templateUrl: 'reconcile/reconcile_query.html',
        controller: 'reconcileQueryCtr'
      })
      .when('/reconcile/edit', {
        templateUrl: 'reconcile/reconcile_edit.html',
        controller: 'reconcileEditCtr'
      })
      .when('/reconcile/settlement', {
        templateUrl: 'reconcile/settlement_query.html',
        controller: 'reconcileSettlementCtr'
      })
      .when('/reconcile/settlementDate', {
          templateUrl: 'reconcile/settlement_Date.html',
          controller: 'reconcileSettlementDateCtr'
      })
      .when('/reconcile/settlementMerchantQuery', {
          templateUrl: 'reconcile/settlementMerchant_query.html',
          controller: 'settlementMerchantQueryCtr'
      })
      .when('/store/storeuser_edit', {
          templateUrl: 'store/store_user_edit.html',
          controller: 'storeuserEditCtr'
      })
     .when('/main/welcome', {
         templateUrl: 'main/welcome.html',
         controller: 'welcomeCtr'
     })
     .when('/account/detail', {
         templateUrl: 'account/detail.html',
         controller: 'accountCtr'
     })      
    .otherwise({ redirectTo: '/main/welcome' });
}]);

app.run(['$rootScope', '$localStorage', '$sessionStorage',  function($rootScope, $localStorage, $sessionStorage){
  $rootScope.userInfo=$localStorage.$default({
      userName:'',
      roleId:0,
      userId:0,
      userToken:''
  });
}]);