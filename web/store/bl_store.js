//var app=angular.module('app');
app.controller('storeAddCtr', function($scope, service){
	$scope.isSuccess=false;
	$scope.errorMessage='';

	$scope.init=function(){
		$scope.ts=[];
		for(i=1;i<=7;++i){
			$scope.ts.push({name:'T+'+i, value:i});
		}

		$scope.basicInfo={
				MerchantToken:'',
				PickupUrl:'',
				MerchantStatus:'1',
				MerchantSettlementPeriod:3,
				MerchantDesc:'',
		};	
	}
	
	$scope.onSubmit=function(){

		if($scope.addStoreForm.$valid){
			var now=new Date();
			$scope.basicInfo.MerchantStartDate=now.getFullYear()+'-'+(now.getMonth()+1)+'-1';
			$scope.basicInfo.MerchantEndtDate=(now.getFullYear()+1)+'-'+(now.getMonth()+1)+'-27';
			//$scope.basicInfo.MerchantCode='M'+now.getFullYear()+now.getMonth()+''+now.getDay()+''+now.getHours()+now.getMinutes()+''+now.getSeconds();

			service.addMerchant($scope.basicInfo, function(result){
				$scope.isSuccess=result.IsSuccess;
				$scope.errorMessage=result.ErrorMessage;
				if($scope.isSuccess){
					$scope.init();
				}
			});
		}
	}

	$scope.init();
});

app.controller('storeEditCtr', function ($scope, service, $filter, ngTableParams, $translate) {
	var data=[];
	$scope.statusDic = [{ id: 1, name: $translate.instant("merchant_new_status_1") }, { id: 2, name: $translate.instant("merchant_new_status_2") }];
	

	$scope.init=function(){
		$scope.ts=[];
		for(i=1;i<=7;++i){
			$scope.ts.push({name:'T+'+i, value:i});
		}

		service.invokeGet('FeePackage/GetFeePackageAsync', null, function(result){
			$scope.feepackages=result.Results.Data;
		});	

		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10          // count per page
	    }, {
	        total: 0, // length of data
	        getData: function($defer, params) {
	           service.invokePost('Merchant/QueryMerchantData', {
							MerchantCode:$scope.merchantCode||'',
							MerchantDesc:$scope.merchantDesc||'',
							MerchantStatus:$scope.merchantStatus||'',
							PageIndex:params.page(),
							PageSize:params.count()
					}, 
					function(result){
						$scope.isSuccess=result.IsSuccess;
						$scope.errorMessage=result.ErrorMessage;
						if(result.IsSuccess){
							data=result.Results;
							params.total(data.Total);
							$defer.resolve(data.List);
						}else{
							data=[];
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

	$scope.onSave=function(store){
		var fee=store.Feevalue;
		var number=Number(fee);
		if(fee==null || fee.length<1
			|| number<=0){
			alert('请输入正的1~20位数字的费率');
			return;
		}

		if(store.MerchantDesc==null || store.MerchantDesc.length<1
			|| store.MerchantDesc.length>50){
			alert('请输入正的1~50位商户信息');
			return;
		}
		service.invokePost('Merchant/PutMerchant', store, function(result){
			$scope.isSuccess=result.IsSuccess;
			$scope.errorMessage=result.ErrorMessage;
			if ($scope.isSuccess) {
			    store.$edit = false;
			} else {
			    $scope.errorMessage = result.ErrorMessage;
			}
		})
		
	}

	$scope.onClickDetail=function(item){
		service.invokePost('Merchant/GetMerchantDetails', 
			{MerchantCode: item.MerchantCode},
			function(result){
			    if (result.IsSuccess) {			      
			        $scope.storeInfo = result.Results;
			        $scope.errMessage = '';
					$('#myModal').modal('show');
				}
		});
	}

	$scope.onUpdateDetail = function (item) {
		//if($scope.updateStoreForm.$valid){
			service.invokePost('Merchant/PutMerchant', 
				item,
				function (result) {
				    $scope.isSuccess = result.IsSuccess;
				    $scope.errMessage = result.ErrorMessage;
				    if (result.IsSuccess) {
				        $('#myModal').modal('hide');
				        $scope.tableParams.reload();
				    }				   
			});
		//}
	}

	$scope.init();
});

app.controller('storeInfoCtr', function($scope, service){
	$scope.userId=$scope.userInfo.userId;
	$scope.storeInfo={};
	service.getMerchantInfoByUserId($scope.userId).then(function(result){
		if(result.IsSuccess){
			$scope.storeInfo=result.Results.Data;
		}
		else {
		    $scope.errorMessage = result.ErrorMessage;
		}
	});
});

app.controller('storeuserEditCtr', function ($scope, service, $filter, ngTableParams) {
    var data = [];
    $scope.userData = {};
    $scope.init = function () {
        $scope.ts = [];
        for (i = 1; i <= 7; ++i) {
            $scope.ts.push({ name: 'T+' + i, value: i });
        }

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                if ($scope.userForm.$valid) {
                    service.getStoreUsers({
                        StoreId: $scope.userInfo.storeId,
                        UserId: $scope.userId || '',
                        UserName: $scope.userName || '',
                        PageIndex: params.page(),
                        PageSize: params.count()
                    },
                         function (result) {
                             if (result.IsSuccess) {
                                 data = result.Results;
                                 params.total(data.Total);
                                 $defer.resolve(data.List);
                             } else {
                                 data = [];
                                 params.total(0);
                                 $defer.resolve([]);
                             }
                         });
                }
            }
        });
    }

    $scope.onQuery = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    $scope.onClickDetail = function (item) {
        service.getStoreUsers({ StoreId: $scope.userInfo.storeId, UserId: item.UserId },
			function (result) {
			    if (result.IsSuccess) {
			        $scope.userData = result.Results.List[0];
			        $('#myModal').modal('show');
			    }
			});
    }

    $scope.onUpdateDetail = function (item) {
        service.invokePost('Account/ModifyUserDetail',
            item,
            function (result) {
                $scope.isSuccess = result.IsSuccess;
                $scope.errMessage = result.ErrorMessage;
                if (result.IsSuccess) {
                    $('#myModal').modal('hide');
                    $scope.tableParams.reload();
                }
            });
    }

    $scope.init();
});

app.controller('withdrawRequestCtr', function($scope){
	$scope.requestInfoitems=[
		{name:'商户号', value:'11000232324332'},
		{name:'余额', value:'26778812732.00'},
		{name:'申请总笔数', value:'2'},
		{name:'申请总金额', value:'38900.00'},
		{name:'可用金额', value:'278877.00'},
	];
});

app.controller('withdrawQueryCtr', function($scope){
	$scope.requests=[
		{timestamp:'2015-7-12', value:'1230.00', status:'成功'},
		{timestamp:'2015-7-11', value:'2223.00', status:'成功'},
		{timestamp:'2015-7-10', value:'1112.00', status:'成功'},
		{timestamp:'2015-7-09', value:'3345.00', status:'成功'},
		{timestamp:'2015-7-08', value:'8902.00', status:'成功'},
		{timestamp:'2015-6-12', value:'1230.00', status:'成功'},
		{timestamp:'2015-6-11', value:'2223.00', status:'成功'},
		{timestamp:'2015-6-10', value:'1112.00', status:'成功'},
		{timestamp:'2015-6-09', value:'3345.00', status:'成功'},
		{timestamp:'2015-6-08', value:'8902.00', status:'成功'},
		{timestamp:'2015-5-12', value:'1230.00', status:'成功'},
		{timestamp:'2015-5-11', value:'2223.00', status:'成功'},
		{timestamp:'2015-5-10', value:'1112.00', status:'成功'},
		{timestamp:'2015-5-09', value:'3345.00', status:'成功'},
		{timestamp:'2015-5-08', value:'8902.00', status:'成功'},
		{timestamp:'2015-4-12', value:'1230.00', status:'成功'},
		{timestamp:'2015-4-11', value:'2223.00', status:'成功'},
		{timestamp:'2015-4-10', value:'1112.00', status:'成功'},
		{timestamp:'2015-4-09', value:'3345.00', status:'成功'},
		{timestamp:'2015-4-08', value:'8902.00', status:'成功'},
	];
});
