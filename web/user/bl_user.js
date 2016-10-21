app.controller('addUserCtr', function ($scope, service) {
    $scope.user = {};
    $scope.ts = [];
    for (i = 1; i <= 7; ++i) {
        $scope.ts.push({ name: 'T+' + i, value: i });
    }

    var merchant = $scope.userInfo.roleId == 4 ? $scope.userInfo.storeId : null;
    service.invokePost('Merchant/QueryMerchantsList', { storeId: merchant }, function (result) {
        $scope.merchants = result.Results.Data;
    });

	$scope.onSubmit=function(){
		if($scope.addUserForm.$valid){
			service.invokePost('Account/PostNewUser', {
			UserName:$scope.user.userName,
			Password:$scope.user.password,
			StoreId:$scope.user.storeId||0,
			IsRemembered:true,
			RoleId:$scope.user.roleId||0,
			UserToken: '',
			UserAccountBank: $scope.user.UserAccountBank,
			UserAccountNo: $scope.user.UserAccountNo,
			UserAccountName: $scope.user.UserAccountName,
			UserSettlementPeriod: $scope.user.UserSettlementPeriod||0,
			Feevalue: $scope.user.Feevalue || 0
			}, function(result){
				$scope.isSuccess=result.IsSuccess;
				$scope.errorMessage=result.ErrorMessage;
				if($scope.isSuccess){
					$scope.user={};
				}
			});
		}
	}
});

app.controller('editUserCtr', function($scope, service,  $filter, ngTableParams){
    var data = [];
    $scope.userData = {};
	$scope.init = function () {
	    $scope.ts = [];
	    for (i = 1; i <= 7; ++i) {
	        $scope.ts.push({ name: 'T+' + i, value: i });
	    }

	    $scope.isSys = $scope.currentFeature.FeatureId == 5;
		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10          // count per page
	    }, {
	        total: 0, // length of data
	        getData: function ($defer, params) {
	            if ($scope.userForm.$valid) {
	                service.geUsers({
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

	$scope.changeUserStatus=function(user, status){
		service.invokePost('Account/ChangeUserStatus',{
			username:user.UserName,
			isLocked:user.IsLocked
		}, function(result){
			user.$edit=false;
		});
	}

	$scope.onQuery=function(){
		$scope.tableParams.page(1);
		$scope.tableParams.reload();
	}

	$scope.onClickDetail = function (item) {	
	    service.geUsers({ UserId: item.UserId },
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

app.controller('passwordChangeCtr', function($scope,service,$translate){
	$scope.username=$scope.userInfo.userName;
	 $scope.isSuccess = false;
	$scope.errorMessage='';
	$scope.password='';
	$scope.newpassword='';
	$scope.newpassword2='';
	$scope.onChangePassword = function () {
	    $scope.isSuccess = false;
		if($scope.password.length<1){
			$scope.errorMessage=$translate.instant("user_pwd_error_empty_org"); // '原始密码不能为空';
		}else if($scope.newpassword.length<8 
			|| $scope.newpassword.length>12){
			$scope.errorMessage=$translate.instant("user_pwd_error_new"); //
		}else if($scope.newpassword2.length<8
			|| $scope.newpassword2.length>12){
			$scope.errorMessage=$translate.instant("user_pwd_error_confirm"); //
		}else if($scope.newpassword!=$scope.newpassword2){
			$scope.errorMessage=$translate.instant("user_pwd_error_not_match"); //
		}else if($scope.password==$scope.newpassword){
			$scope.errorMessage=$translate.instant("user_pwd_error_are_equal"); //
		}else{
			service.changePassword({
						username:$scope.username,
						password:$scope.password,
						newPassword:$scope.newpassword
					}, function(result){
						$scope.isSuccess=result.IsSuccess;
						$scope.errorMessage = result.ErrorMessage || 'Operation success';
						if ($scope.isSuccess) {
						    $scope.onReset();						 
						}
			});	
		}
	}
	$scope.onReset=function(){
		$scope.password='';
		$scope.newpassword='';
		$scope.newpassword2='';
	}

});

app.controller('lockUserCtr', function($scope, service){
	$scope.username=$scope.userInfo.userName;
	$scope.isSuccess=false;
	$scope.errorMessage='';
	$scope.changeUserStatus=function(status){
		service.changeUserStatus({username:$scope.username, isLocked:status}, function(result){
			$scope.isSuccess=result.IsSuccess;
			$scope.errorMessage=result.ErrorMessage||'Operation success';
		});
	}
});

app.controller('userPermissionCtr', function($scope, service){
	$scope.isSuccess=false;
	$scope.errorMessage='';
	$scope.roles=[];
	$scope.features=[];

	$scope.init=function(){
		service.invokeGet('UserPermission/GetSysUserRole', null, function(result){
			$scope.roles=result.Results.Data;
		});
	}

	$scope.onSlectRole=function(item){
		service.invokePost('UserPermission/QueryUserRoleFeature',{roleId:$scope.currentRole}, function(result){
			$scope.errorMessage=result.ErrorMessage;
			$scope.isSuccess=result.IsSuccess;
			$scope.features=result.Results;
		});
	}

	$scope.onSubmit=function(){
		service.invokePost('UserPermission/ChangeUserRoleFeature',
			{
				roleId:$scope.currentRole, 
				roleFeatureList:$scope.features
			}, function(result){
				$scope.errorMessage=result.ErrorMessage;
				$scope.isSuccess=result.IsSuccess;
				if($scope.isSuccess){
					window.location.reload();
				}
				//$scope.features=result.Results;
		});
	}
	
	$scope.init();
});
