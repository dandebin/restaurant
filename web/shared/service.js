app.service('service', function($http, config, $q){
		this.url=config.serviceUrl;
		var deferred = $q.defer();

		this.invokeGet=function(action, data, then){
			var deferred = $q.defer();
			$.get(this.url+ action, data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.invokePost=function(action, data, then){
			var deferred = $q.defer();
			$.post(this.url+ action, data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.saveUserInLocale=function(user){
			window.localStorage.setItem('userInfo', JSON.stringify(user));
		}

		this.getUserFromLocale=function(){
			var user = window.localStorage.getItem('userInfo');
			return $.parseJSON(user);
		}

		this.removeUserFromLocale=function(){
			window.localStorage.setItem('userInfo', '');
		}

		this.getExchangeRate=function(data, then){
			//$.post(this.url+'Transaction/GetTransactionDetail', data, then);
			
			$.post(this.url+'ExchangeRate/GetExchangeRate', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		
		}

		this.approveExchangeRate=function(data, then){
			$.post(this.url+'ExchangeRate/PutExchangeRateVerified', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.submitExchangeRate=function(data, then){
			$.post(this.url+'ExchangeRate/PostExchangeRate', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.getHistoryRateDown = function (data, then) {
		    $.post(this.url + 'ExchangeRate/DownloadRateExcel', data, then);
		}

		this.getExchangeRate=function(data, then){
			//$.post(this.url+'Transaction/GetTransactionDetail', data, then);
			
			$.post(this.url+'ExchangeRate/GetExchangeRate', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});		
		}

		this.getCurrentTransactions=function(data, then){
			$.post(this.url+'Transaction/GetTransactionByPaging', data, then);
		}

		this.getCurrentTransactionsDown =function(data, then) {
		    $.post(this.url + 'Transaction/DownloadTransactionExcel', data, then);
		}		

		this.downloadExcel = function (s) {
		    window.location.href = s;
		};

		this.GetTransactionDetail=function(data, then){
			//$.post(this.url+'Transaction/GetTransactionDetail', data, then);
			
			$.post(this.url+'Transaction/GetTransactionDetail', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		
		}

		this.login=function(data, then){
			var deferred = $q.defer();
			$.post(this.url+'UserService.asmx/Login', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.getMerchantInfoByUserId=function(userId){
			var deferred = $q.defer();
			$.get(this.url+'Merchant/GetMerchantsInforByUserId', {userId:userId})
			.success(function(data){
				deferred.resolve(data);
			});
			return deferred.promise;
		}

		this.addMerchant=function(data, then){
			$.post(this.url+'Merchant/PostMerchant', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.getUserFeatures=function(userName, then){
			var deferred = $q.defer();
			$.get(this.url+'Login/GetFeatures', {userName:userName})
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.geUsers=function(data, then){
			var deferred = $q.defer();
			$.post(this.url+'Account/GetUserInforData', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}
		
		this.changePassword=function(data, then){
			var deferred = $q.defer();
			$.post(this.url+'Account/ChangePassword', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}

		this.getStoreUsers = function (data, then) {
		    var deferred = $q.defer();
		    $.post(this.url + 'Account/GetStoreUserData', data)
			.success(function (data) {
			    deferred.resolve(data);
			    deferred.promise.then(then(data));
			});
		}

		this.changeUserStatus=function(data, then){
			var deferred = $q.defer();
			$.post(this.url+'Account/ChangeUserStatus', data)
			.success(function(data){
				deferred.resolve(data);
				deferred.promise.then(then(data));
			});
		}
});


