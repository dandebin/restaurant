//var app=angular.module('app',['ngRoute', 'pascalprecht.translate','ngRoute', 'ngResource', 'ngTable', 'ngTableExport']);
//var app=angular.module('app');
app.controller('rateHistoryCtr', function ($scope, service, $filter, ngTableParams, $translate) {
	var data=[];
	var today=new Date();
	$scope.rateFromTime=today.getFullYear()+'-'+(today.getMonth()+1)+'-1 ';
	$scope.rateToTime=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';
	var option={pickTime: false};
	$('.rateFromTime').datetimepicker(option);   
	$('.rateToTime').datetimepicker(option);

	$scope.init = function () {
	    $scope.titles = {
	        CreatedDatetime: $translate.instant('rate_date'),
	        OriginalCurrencyName: $translate.instant('rate_currency_org'),
	        CurrencyName: $translate.instant('rate_currency_tar'),
	        Rate: $translate.instant('rate_rate'),
	        IsVerified: $translate.instant('rate_status'),
	        Applicant: $translate.instant('refund_query_applicant'),
	        Approval: $translate.instant('refund_query_approval'),
	        ApprovalTime: $translate.instant('refund_query_approvaltime')
	    };

		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        sorting: {
	            CreatedDatetime: 'desc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.getExchangeRate({
							ExchangeRateFrom: $('.rateFromTime input').val() +' 00:00:00.000',
							ExchangeRateTo: $('.rateToTime input').val() + ' 23:59:59.999',
							Applicant: $scope.applicant,
							Approval: $scope.approval,
							PageIndex:params.page(),
							PageSize: params.count(),							
							Sort: params.sorting()
					}, 
					function(result){
						$scope.errorMessage=result.ErrorMessage;
						$scope.isSuccess=result.IsSuccess;
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

	$scope.onQueryRate=function(){
		$scope.tableParams.reload(); 
	}

	$scope.onDownLoadHistoryRate = function () {
	    if (!$scope.isSuccess) return;
	    service.getHistoryRateDown({
	        ExchangeRateFrom: $('.rateFromTime input').val() + ' 00:00:00.000',
	        ExchangeRateTo: $('.rateToTime input').val() + ' 23:59:59.999',
	        Applicant: $scope.applicant,
	        Approval: $scope.approval,
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

	$scope.init();
});

app.controller('changeRequestCtr', function ($scope, service, $filter, ngTableParams, $translate) {
	var data=[];
	var today=new Date();
	today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';
	$scope.currencies=[];

	$scope.init = function () {	   
		service.invokeGet('Currency/GetCurrencyDataAsync', null, function(result){
			$scope.currencies=result.Results.Data;
		});

		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10          // count per page	       
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.getExchangeRate({
							ExchangeRateFrom: today +' 00:00:00.000',
							ExchangeRateTo: today+ ' 23:59:59.999',
							PageIndex:params.page(),
							PageSize: params.count()
					}, 
					function(result){
					    $('#loading').hide();
					    $scope.isSuccess = result.IsSuccess;
					    $scope.errorMessage = result.ErrorMessage;					    
						if(result.IsSuccess){
							data=result.Results;
							params.total(data.Total);
							$defer.resolve(data.List);
						}
				});
	        }
	    });
	};

	$scope.reset=function(){
		$scope.originalCurrencyId=0;
		$scope.currencyId=0;
		$scope.rate=0;
	}

	$scope.onSubmit=function(){
		var rate=$scope.rate;
		var number=Number(rate);
		if(rate==null || rate.length<1
			|| number<=0){
			alert($translate.instant("common_error_number"));
			return;
		}
		
		if(!$scope.changeRateForm.$valid){
			return;
		}
		service.submitExchangeRate(
			{
				OriginalCurrencyId: $scope.originalCurrencyId,
				CurrencyId:$scope.currencyId,
				Rate:$scope.rate,
				CreatedDatetime: new Date().toJSON(),
				userName: $scope.userInfo.userName
			}, function(result){
				$scope.errorMessage=result.ErrorMessage;
				$scope.isSuccess=result.IsSuccess;
				if($scope.isSuccess){
					$scope.tableParams.reload(); 
				}
		});
	};

	$scope.onSave=function(rateInfo){
		var rate=rateInfo.Rate;
		var number=Number(rate);
		if(rate==null || rate.length<1
			|| number<=0){
			alert($translate.instant("common_error_number"));
			return;
		}
		service.invokePost('ExchangeRate/PutExchangeRate', rateInfo, function(result){
			rateInfo.$edit=false;
		});
	}

	$scope.init();
});

app.controller('rateApproveCtr', function($scope, service,  $filter, ngTableParams, $translate){
	var data=[];
	var today=new Date();
	today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';

	$scope.init=function(){
		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10          // count per page
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.getExchangeRate({
							ExchangeRateFrom: today +' 00:00:00.000',
							ExchangeRateTo: today+ ' 23:59:59.999',
							PageIndex:params.page(),
							PageSize:params.count()
					}, 
					function(result){
						$('#loading').hide();
						if(result.IsSuccess){
							data=result.Results;
							params.total(data.Total);
							$defer.resolve(data.List);
						}
				});
	        }
	    });
	};

	$scope.onApprove = function (rateInfo, status) {
	    var tip = $translate.instant("rate_approve_btnstate_" + status);
	    tip = tip.indexOf('?')== -1?$translate.instant("common_confirm_submit")
	           : ((tip.replace("{0}", rateInfo.OriginalCurrencyName)).replace("{1}", rateInfo.CurrencyName)).replace("{2}", "1:" + new Number(rateInfo.Rate).toFixed(4));
	    if (confirm(tip)) {
			service.approveExchangeRate({
			    exchangeRateId:rateInfo.ExchangeRateId,
			    userName: $scope.userInfo.userName,
			    verifiedStatus:status},
			function(result){
				$scope.tableParams.reload(); 
			});
		}		
	}	

	$scope.init();
});