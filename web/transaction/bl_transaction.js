//var app=angular.module('app', ['ngRoute', 'ngResource', 'ngTable', 'ngTableExport']); //'ui.bootstrap'

app.controller('transactionCtr', function ($scope, service, $filter, ngTableParams, $translate) {
	var data=[];
	$scope.merchants=[];
	$scope.td={};
	var today=new Date();
	var today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';
	$scope.orderFromTime='00:00',
	$scope.orderToTime='23:59',

    $scope.init=function(){
    	$scope.status='-1';
    	var option={pickDate: false};
    	$('.orderFromTime').datetimepicker(option);   
		$('.orderToTime').datetimepicker(option);
		
		$scope.titles = {
		    MerchantCode: $translate.instant('merchant_edit_desc'),
		    UserName: $translate.instant('user_edit_name'),
		    OrderNo: $translate.instant('tran_order_id'),
		    OrderStatus: $translate.instant('tran_status'),
		    OrderDateTime: $translate.instant('tran_order_date'),
		    CurrencyDesc: $translate.instant('tran_currency'),
		    Amount: $translate.instant('tran_amount'),
		    Operation: $translate.instant('common_btn_option')
		};

		var merchant = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : null;
		service.invokePost('Merchant/QueryMerchantsList', { storeId: merchant }, function (result) {
		    $scope.merchants = result.Results.Data;
		});

		var user = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : 0;
		service.invokeGet('UserPermission/QueryUsersList', { merchantCode: "", merchantId: user }, function (result) {
		    $scope.users = result.Results;
		});

     	$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        sorting: {
	            OrderDateTime: 'desc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.getCurrentTransactions({
	           				OrderNo:$scope.orderNo||'',
							OrderId:$scope.orderId||0,
							OrderFrom: today+' '+ $('[ng-model=orderFromTime]').val() +':00.000',
							OrderTo: today+' '+ $('[ng-model=orderToTime]').val()+ ':00.999',					
							PayFrom: '1990-01-01',				
							PayTo: '9999-01-01',						
							Status:$scope.status||-1,
							MerchantId: $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : ($scope.merchantId || 0),
							UserId: $scope.merchantuserId || 0,
							PageIndex:params.page(),
							PageSize: params.count(),
							Sort: params.sorting()
					}, 
					function(result){
						if(result.IsSuccess){
							data=result.Results;
							params.total(data.Total);
							$defer.resolve(data.List);
						}else{
							params.total(0);
							$defer.resolve([]);
						}
				});
	        }
	    });
    }

	$scope.onQuery=function(){
		$scope.tableParams.page(1);
		$scope.tableParams.reload(); 
	}

	$scope.onClickDetail=function(item){
		service.GetTransactionDetail({orderId: item.OrderId},function(result){
			if(result.IsSuccess){
				$scope.td=result.Results.Data;
				$('#myModal').modal('show');
			}
			
		});
	}

	$scope.init();
});

app.controller('transactionHistoryCtr', function($scope, service,  $filter, ngTableParams, $translate){
	var data=[];
	$scope.td={};
	$scope.merchants=[];
	var today=new Date();
	var start=today.getFullYear()+'/'+(today.getMonth()+1)+'/1 ';
	var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';
	$scope.orderFromTime=start,
	$scope.orderToTime=today,
	
    $scope.init=function(){
    	$scope.status='-1';
    	var option={pickTime: false};
    	$('.orderFromTime').datetimepicker(option);   
		$('.orderToTime').datetimepicker(option);

		$scope.titles={
		    MerchantCode: $translate.instant('merchant_edit_desc'),
		    UserName: $translate.instant('user_edit_name'),
			OrderNo: $translate.instant('tran_order_id'),
			OrderStatus: $translate.instant('tran_status'),
			OrderDateTime: $translate.instant('tran_order_date'),
			CurrencyDesc: $translate.instant('tran_currency'),
			Amount: $translate.instant('tran_amount'),
			Operation: $translate.instant('common_btn_option'),
		};

		var merchant = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : null;
		service.invokePost('Merchant/QueryMerchantsList', { storeId: merchant }, function (result) {
		    $scope.merchants = result.Results.Data;
		});

		var user = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : 0;
		service.invokeGet('UserPermission/QueryUsersList', { merchantCode: "", merchantId: user }, function (result) {
		    $scope.users = result.Results;
		});
		
    	$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        sorting: {
	            OrderDateTime: 'desc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.getCurrentTransactions({
							OrderNo:$scope.orderNo||'',
							OrderId:$scope.orderId||0,
							OrderFrom: $('[ng-model=orderFromTime]').val() + ' 00:00',
							OrderTo: $('[ng-model=orderToTime]').val()+ ' 23:59:59',					
							PayFrom: '1990-01-01',					
							PayTo: '9999-01-01',					
							Status:$scope.status||-1,
							MerchantId: $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : ($scope.merchantId || 0),
							UserId: $scope.merchantuserId || 0,
							PageIndex:params.page(),
							PageSize:params.count(),
							Sort: params.sorting()
					}, 
					function (result) {
					    $scope.errorMessage = result.ErrorMessage;
					    $scope.isSuccess = result.IsSuccess;
						if(result.IsSuccess){
							data=result.Results;
							params.total(data.Total);
							$defer.resolve(data.List);
						}else{
							params.total(0);
							$defer.resolve([]);
						}
				});
	        }
	    });
    };    

	$scope.onQueryHistory=function(){
		$scope.tableParams.page(1);
		$scope.tableParams.reload(); 
	}

	$scope.onDownLoadQueryHistory = function () {
	    if (!$scope.isSuccess) return;
	    service.getCurrentTransactionsDown({
	        OrderNo: $scope.orderNo || '',
	        OrderId: $scope.orderId || 0,
	        OrderFrom: $('[ng-model=orderFromTime]').val() + ' 00:00',
	        OrderTo: $('[ng-model=orderToTime]').val() + ' 23:59:59',	    
	        Status: $scope.status || -1,
	        MerchantId: $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : ($scope.merchantId || 0),
	        UserId: $scope.merchantuserId || 0,
	        Sort: $scope.tableParams.sorting()
	    }, function (result) {
	        if (result.IsSuccess) {	          
	            service.downloadExcel(result.Results);
	        }
	        else {
	            $scope.errorMessage = result.ErrorMessage;	         
	        }	             
	    });	
	}

	$scope.onClickDetail=function(item){
		service.GetTransactionDetail({orderId: item.OrderId},function(result){
			if(result.IsSuccess){
				$scope.td=result.Results.Data;
				$('#myModal').modal('show');
			}
			
		});
	}
	
	$scope.init();
});