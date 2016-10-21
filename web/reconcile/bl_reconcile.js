app.controller('reconcileQueryCtr', function ($scope, service, $filter, ngTableParams, $translate) {
    $scope.isSuccess=false;
    $scope.errorMessage='';
    $scope.request={};
    

    $scope.init=function(){
        var today=new Date();
        var from = today.getFullYear()+'/'+(today.getMonth()+1)+'/1';
        var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';
        var option = { pickTime: false };       
        $('.reconcileFrom').datetimepicker(option);  
        $('.reconcileFrom input').val(from);
        $('.reconcileTo').datetimepicker(option);  
        $('.reconcileTo input').val(today); 
      
        service.invokeGet('Merchant/QueryReconcileMerchants', null, function (result) {
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
            getData: function ($defer, params) {
                var n_reconcileFrom = $('.reconcileFrom input').val();
                var n_reconcileTo = $('.reconcileTo input').val();
                if (new Date(n_reconcileFrom).getTime() > new Date(n_reconcileTo).getTime()) {
                    $scope.isSuccess = false;
                    $scope.errorMessage = $translate.instant('refund_query_error_daterange');                
                    return;
                }
               service.invokePost('Reconcile/GetReconcileData',{
                            reconcileFrom:$('.reconcileFrom input').val(),
                            reconcileTo:$('.reconcileTo input').val(),
                            merchantCode: $scope.request.merchantCode,
                            pageIndex:params.page(),
                            pageSize:params.count()
                    }, 
                    function (result) {
                        $scope.isSuccess = result.IsSuccess;
                        if(result.IsSuccess){
                            data=result.Results;
                            params.total(data.Total);
                            $defer.resolve(data.List);
                            $scope.isSuccess = false;
                            $scope.errorMessage = "";
                        } else {
                            $scope.errorMessage = result.ErrorMessage;
                            params.total(0);
                            $defer.resolve([]);
                        }
                });
            }
        });
    }
    $scope.clickTag = function ($event) {
        $('.reconcileFrom').datetimepicker('show');
    }
    $scope.onQuery=function(){
        $scope.tableParams.page(1);
        $scope.tableParams.reload(); 
    }

	$scope.onDownload = function (reconcileInfo) {
	    service.invokePost('Reconcile/DownloadTranReconcile', {
	        reconcileId: reconcileInfo.ReconcileId,
	        reconcileDate: reconcileInfo.ReconcileDate,
	        merchantCode: reconcileInfo.MerchantCode,
	    },
					function (result) {
					    if (result.IsSuccess) {
					        service.downloadExcel(result.Results);
					    }
					    else {
					        $scope.isSuccess = result.IsSuccess;
					        $scope.errorMessage = result.ErrorMessage;
					    }
					});


    }

    $scope.init();
});

app.controller('reconcileSettlementCtr', function($scope, service, $filter, ngTableParams){
    $scope.isSuccess=false;
    $scope.errorMessage='';
    $scope.request={};
    

    $scope.init=function(){
        var today=new Date();
        var from = today.getFullYear()+'/'+(today.getMonth()+1)+'/1';
        var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';
        var option={pickTime: false};
        $('.reconcileFrom').datetimepicker(option);  
        $('.reconcileFrom input').val(from);
        $('.reconcileTo').datetimepicker(option);  
        $('.reconcileTo input').val(today);

        //Disable select for Merchant user
        if($scope.userInfo.roleId==4){
            $scope.request.merchantCode=$scope.userInfo.storeId;
        }else{
            service.invokeGet('Reconcile/GetMerchantForInpal', null, function (result) {
                $scope.merchants=result.Results;
            });
        }

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: 0, // length of data
            getData: function($defer, params) {
                service.invokePost('Reconcile/QuerySettlementProcessData', {
                            merchantSettlementFrom: $('.reconcileFrom input').val(),
                            merchantSettlementTo: $('.reconcileTo input').val(),
                            merchantCode: $scope.request.merchantCode,
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


    $scope.init();

	$scope.onQuery = function () {
	    $scope.tableParams.page(1);
	    $scope.tableParams.reload();
	}

	$scope.onDownload = function (reconcileInfo) {
	    service.invokePost('Reconcile/DownloadSettlement', {	       
	        id: reconcileInfo.ID,
	        ReconcileDate: reconcileInfo.ReconcileDate,
	        MerchantCode: reconcileInfo.MerchantCode
	    },
					function (result) {
					    if (result.IsSuccess) {
					        service.downloadExcel(result.Results);
					    }
					    else {
					        $scope.errorMessage = result.ErrorMessage;
					    }
					});
	}

	$scope.onSealed = function (reconcileInfo) {
	    service.invokePost('Reconcile/SealSettlementForIngPal', {
	        SettlementForIngPalID: reconcileInfo.ID,
	    },
					function (result) {
					    if (result.IsSuccess) {
					        $scope.tableParams.page(1);
					        $scope.tableParams.reload();
					    }
					    else {
					        $scope.errorMessage = result.ErrorMessage;
					    }
					});
	}

	$scope.init();

});

app.controller('reconcileEditCtr', function($scope, service, $filter, ngTableParams){
    $scope.isSuccess=false;
    $scope.errorMessage='';
    $scope.request={};
    

    $scope.init=function(){
        var today=new Date();
        var from = today.getFullYear()+'/'+(today.getMonth()+1)+'/1';
        var today = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+(today.getDate())+' ';
        var option={pickTime: false};
        $('.reconcileFrom').datetimepicker(option);  
        $('.reconcileFrom input').val(from);
        $('.reconcileTo').datetimepicker(option);  
        $('.reconcileTo input').val(today);

        //Disable select for Merchant user
        if($scope.userInfo.roleId==4){
            $scope.request.merchantCode=$scope.userInfo.storeId;
        }else{
            service.invokeGet('Merchant/QueryMerchantsList', null, function(result){
                $scope.merchants=result.Results.Data;
            });
        }       

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                service.invokePost('Reconcile/GetReconcileProcess', {
                    reconcileFrom: $('.reconcileFrom input').val(),
                    reconcileTo: $('.reconcileTo input').val(),
                    merchantCode: $scope.request.merchantCode,
                    pageIndex: params.page(),
                    pageSize: params.count()
                },
                     function (result) {
                         if (result.IsSuccess) {
                             data = result.Results;
                             params.total(data.Total);
                             $defer.resolve(data.List);
                         } else {
                             params.total(0);
                             $defer.resolve([]);
                         }
                     });
            }
        });
    }

    $scope.changeReconcileProcess = function (reconcile, status) {
        service.invokePost('Reconcile/ProcessReconcileList', {
            ReconcileDetailId: reconcile.ReconcileDetailId,
            ReconcileResultId: reconcile.ReconcileResultId,
            ReconcileProcessState: reconcile.ReconcileProcessStateChar,
            Amount: reconcile.ReconcileProcessAmount,
            IsSave : true
        }, function (result) {
            reconcile.$edit = false;
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        });
    }

    $scope.deleteReconcileProcess = function (reconcile, status) {
        service.invokePost('Reconcile/ProcessReconcileList', {
            reconcileDetailId: reconcile.ReconcileDetailId,
            ReconcileProcessState: reconcile.ReconcileProcessStateChar,
            IsSave: false
        }, function (result) {
            reconcile.$edit = false;
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        });
    }

    $scope.onQuery=function(){
        $scope.tableParams.page(1);
        $scope.tableParams.reload(); 
    }

    $scope.onRedoReconcile = function () {

        var arr = new Array();


        $(":checkbox").each(function() {
            if ($(this)[0].checked) {
                var item1 = new Object();
                item1.ResultId = $(this).val();
                item1.Value = "null";

                arr.push(item1);
            }
        });

        $(":radio").each(function () {
            if ($(this).prop("checked")) {
                var item1 = new Object();
                item1.ResultId = $(this).attr("id");
                item1.Value = $(this).val();

                arr.push(item1);
            }
        });

        service.invokePost('Reconcile/SettlementForInpalUnsealed', {

            arr:arr,

            currency: "156"
        }, function (result) {
            $scope.isSuccess = true;
            $scope.errorMessage = "clr_settlement_success";
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        });
    }
    $scope.init();
});

app.controller('reconcileSettlementDateCtr', function ($scope, service, $filter, ngTableParams) {
    $scope.isSuccess = false;
    $scope.errorMessage = "";

    $scope.init = function () {
        var option = { pickTime: false };
        $(".reconcileFrom").datetimepicker(option);

        $scope.tableParams = new ngTableParams({
            page: 1,    // show first page
            count: 10,   // count per page
            sorting: {
            name: 'asc'     // initial sorting
        }
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                service.invokePost('Reconcile/QueryMerchantsSettlementDateList', {
                    PageIndex: params.page(),
                    PageSize: params.count()
                },
                     function (result) {

                         if (result.IsSuccess) {
                             data = result.Results;
                             params.total(data.Total);
                             $defer.resolve(data.List);
                         } else {
                             params.total(0);
                             $defer.resolve([]);
                             $scope.isSuccess = result.IsSuccess;
                             $scope.errorMessage = result.ErrorMessage;
                         }
                     });
            }
        });
    }

    $scope.onAdd = function() {

        var addDate = "";
        var isRun = $("#isRun").val();

        if ($.trim($("input[name='settlementDate1']").val()) !== "") {
            addDate = $.trim($("input[name='settlementDate1']").val());
        } else {
            return;
        }


        service.invokePost('Reconcile/SubmitSettlementDate', {
            date: addDate,
            isRun: isRun
        },
                    function (result) {
                        $scope.isSuccess = result.IsSuccess;
                        $scope.errorMessage = result.ErrorMessage;
                        $scope.tableParams.reload();
                    });
    }

    $scope.init();
});

app.controller('settlementMerchantQueryCtr', function ($scope, service, $filter, ngTableParams) {
    $scope.isSuccess = false;
    $scope.errorMessage = '';
    $scope.request = {};



    $scope.init = function () {
        var nowDay = new Date();
        var from = nowDay.getFullYear() + "/" + (nowDay.getMonth() + 1) + "/1";
        var today = nowDay.getFullYear() + "/" + (nowDay.getMonth() + 1) + "/" + (nowDay.getDate()) + " ";
        var option = { pickTime: false };

        $scope.roleId = $scope.userInfo.roleId;

        $(".reconcileFrom").datetimepicker(option);
        $(".reconcileFrom input").val(from);
        $(".reconcileTo").datetimepicker(option);
        $(".reconcileTo input").val(today);

        //Disable select for Merchant user
        if ($scope.userInfo.roleId === 4) {
            $scope.request.merchantCode = $scope.userInfo.storeId;
            $scope.showSelectMerchant = false;
            $scope.showSelectUser = true;
            service.invokeGet('UserPermission/QueryUsersList', { merchantCode:"", merchantId: $scope.request.merchantCode }, function (result) {
                $scope.users = result.Results;
            });
        } else {
            $scope.showSelectMerchant = true;
            $scope.showSelectUser = true;

            service.invokeGet('Merchant/QueryMerchantsList', null, function (result) {
                $scope.merchants = result.Results.Data;
            });

            service.invokeGet('UserPermission/QueryUsersList', { merchantCode: "", merchantId: 0 }, function (result) {
                $scope.users = result.Results;
            });
        }

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: 0, // length of data
            getData: function ($defer, params) {
                service.invokePost('Reconcile/GetSettlementData', {
                    reconcileFrom: $('.reconcileFrom input').val(),
                    reconcileTo: $('.reconcileTo input').val(),
                    merchantCode: $scope.request.merchantCode,
                    PageIndex: params.page(),
                    PageSize: params.count(),
                    roleId: $scope.userInfo.roleId,
                    userId: $scope.request.userId
                },
                     function (result) {
                         if (result.IsSuccess) {
                             data = result.Results;
                             params.total(data.Total);
                             $defer.resolve(data.List);
                             $scope.isSuccess = false;
                             $scope.errorMessage = "";
                         } else {
                             params.total(0);
                             $defer.resolve([]);
                             $scope.isSuccess = result.IsSuccess;
                             $scope.errorMessage = result.ErrorMessage;
                         }
                     });
            }
        });
    }

    $scope.onQuery = function () {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    $scope.onDownload = function (reconcileInfo) {
        service.invokePost('Reconcile/DownloadSettlementQuery', {        
            userId: reconcileInfo.UserId,
            reconcileDate: reconcileInfo.ReconcileDate,
            merchantCode: reconcileInfo.MerchantCode
        },
					function (result) {
					    if (result.IsSuccess) {
					        service.downloadExcel(result.Results);
					    }
					    else {
					        $scope.errorMessage = result.ErrorMessage;
					    }
					});
    }

    $scope.onSettlement = function (reconcileInfo) {
        service.invokePost('Reconcile/SettlementMerchant', {
        },
					function (result) {
					    if (result.IsSuccess) {
					        $scope.isSuccess = result.IsSuccess;
					        $scope.errorMessage = result.ErrorMessage;
					        $scope.tableParams.reload();
					    }
					    else {
					        $scope.errorMessage = result.ErrorMessage;
					    }
					});


    }

    $scope.init();
});
