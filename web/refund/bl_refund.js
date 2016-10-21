app.controller('addRefundCtr', function($scope, service){
	$scope.isSuccess=false;
	$scope.errorMessage='';
	$scope.refund={};
	var today=new Date();
	var today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';
	var option={pickDate: true};
    $('.orderDatetime').datetimepicker(option); 
    var merchant = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : null;
    service.invokePost('Merchant/QueryMerchantsList', { storeId: merchant }, function (result) {
        $scope.merchants = result.Results.Data;
    });

	service.invokeGet('Currency/GetCurrencyDataAsync', null, function(result){
	    $scope.currencies = result.Results.Data;	  
	});

	$scope.padOrder = function () {
	    var s = $scope.refund.merchantCode || '';	   
	    if (s!='' && $scope.addRefundForm.refundOrderNo.$valid){	    
	        service.invokePost('Refund/QuerMerchantOrder', { merchantCode: s, refundOrderNo: $scope.refund.refundOrderNo }, function (result) {	           
	            if (result.IsSuccess) {
	                $scope.orderInfo = result.Results;
	            }
	            else {
	                $scope.isSuccess = result.IsSuccess;
	                $scope.errorMessage = result.ErrorMessage;
	            }
	        });
	    }
	}

	$scope.onSubmit=function(){
		if($scope.addRefundForm.$valid){
		    service.invokePost('Refund/PostRefund', { refund: $scope.refund, userName: $scope.userInfo.userName, currencyId: $scope.refundCurrencyId }, function (result) {
				$scope.isSuccess=result.IsSuccess;
				$scope.errorMessage=result.ErrorMessage; 
				if($scope.isSuccess){
				    $scope.refund = {};
				    $scope.orderInfo = {};				
                }
			});
		}
		
	}
});

app.controller('queryRefundCtr', function($scope, service, $filter, ngTableParams){
	$scope.isSuccess=false;
	$scope.canEdit=false;
	$scope.errorMessage='';
	$scope.request={refundStatus: "0"};
	var today=new Date();
	var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';

    $scope.init=function(){
        var option = { pickTime: false, autoclose: true, todayHighlight: true, format: 'yyyy/MM/dd'};
    	$('.refundDatetime').datetimepicker(option);  
    	$('.refundDatetime input').val(today);

    	var storeId=$scope.userInfo.roleId == 4?{storeId:$scope.userInfo.storeId}:null;
    	service.invokePost('Merchant/QueryMerchantsList', storeId, function (result) {
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
	            name: 'asc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.invokePost('Refund/GetRefundApprovalData',{
	           				refundDatetime:$('.refundDatetime input').val(),
	           				refundStatus:$scope.request.refundStatus||0,
	           				userId: $scope.request.userId||0,
	                        applicant:$scope.request.applicant,
	                        pageIndex: params.page(),
	                        pageSize: params.count()
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

	$scope.init();
});


app.controller('approveRefundCtr', function($scope, service, $filter, ngTableParams){
	$scope.isSuccess=false;
	$scope.canEdit=true;
	$scope.errorMessage='';
	$scope.request={};
	var today=new Date();
	var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';

    $scope.init=function(){
		var option={pickTime: false,format:"yyyy/MM/dd"};
		$('.refundDatetime').datetimepicker(option);
		$('.refundDatetime input').val(today);

		var merchant = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : null;
		service.invokePost('Merchant/QueryMerchantsList', { storeId: merchant }, function (result) {
		    $scope.merchants = result.Results.Data;
		});

     	$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        sorting: {
	            name: 'asc'     // initial sorting
	        }
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.invokePost('Refund/GetRefundApprovalData',{
	           				refundDatetime:$('.refundDatetime input').val(),
	           				refundStatus:$scope.request.refundStatus||0,
	           				merchantCode: $scope.request.merchantCode,	           			
	           				approval: $scope.request.approval,
							PageIndex:params.page(),
							PageSize:params.count()
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

	$scope.onApprove=function(refund, status){
		service.invokePost('Refund/ApprovalRefundData', 
			{
				refundOrderId:refund.RefundOrderId,
				refundState: status,
				userName: $scope.userInfo.userName
			}, 
			function(result){
				$scope.isSuccess=result.IsSuccess;
				$scope.errorMessage=result.ErrorMessage;
				$scope.onQuery();
		});
	}

	$scope.init();
});