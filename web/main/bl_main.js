//var app=angular.module('controllers');
app.controller('dashboardCtr', function($scope, service){
	
	//google.load("visualization", "1", {packages:["corechart"]});
	//google.setOnLoadCallback(drawChart);
	function drawChart() {
		var today=new Date();
		var ago=new Date(today);
		ago.setDate(today.getDate()-6);
		today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate())+' ';
		ago= ago.getFullYear()+'-'+(ago.getMonth()+1)+'-'+(ago.getDate())+' ';

		service.invokePost('GetAccountDaily', 
			{from: ago, to:today}, 
			function(data){
				var jsonData=$.parseJSON(data.childNodes[0].innerHTML);
				onDraw(jsonData, 'transactionHistory')
		});
	}

	function onDraw(jsonData, id){
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Date');
		data.addColumn('number', '外汇'); // '总交易额');
		data.addColumn('number', "期货"); //
		data.addColumn('number', "股票"); //
		$.map(jsonData, function(key, val){
			data.addRow([
				 new Date(key.Date).toLocaleDateString(),
				 key.FXAmount,
				 key.QHAmount,
				 key.GPAmount
			]);
		});
		var options = {
			title: '每日余额'
		};
		var chart = new google.visualization.LineChart(document.getElementById(id));
		chart.draw(data, options);
	}

	$scope.init=function(){
		$scope.fxAccts=[];
    	$scope.qhAccts=[];
    	$scope.stAccts=[];
		$scope.dashboardData={};
		/*
		service.invokeGet('Dashboard/GetDashboardContent', null, function(result){
			$scope.dashboardData=result.Results.Data;
		});*/
		drawChart();

		service.invokePost('GetAccountInfos', {type:1}, function(data){
	    	$scope.fxAccts=$.parseJSON(data.childNodes[0].innerHTML);
	    });

	   	service.invokePost('GetAccountInfos', {type:2}, function(data){
	    	$scope.qhAccts=$.parseJSON(data.childNodes[0].innerHTML);
	    });

	    service.invokePost('GetAccountInfos', {type:3}, function(data){
	    	$scope.stAccts=$.parseJSON(data.childNodes[0].innerHTML);
	    });
		
	}
	
	$scope.init();
});

app.controller('welcomeCtr', function ($scope, service) {
    $scope.fxAccts=[];
    $scope.qhAccts=[];
    $scope.stAccts=[];

    $scope.init = function () {
        $("div.row-fluid > div > ul.breadcrumb").hide();
    }
    //$scope.init();

    service.invokePost('GetAccountInfos', {type:1}, function(data){
    	$scope.fxAccts=$.parseJSON(data.childNodes[0].innerHTML);
    });

   	service.invokePost('GetAccountInfos', {type:2}, function(data){
    	$scope.qhAccts=$.parseJSON(data.childNodes[0].innerHTML);
    });

    service.invokePost('GetAccountInfos', {type:3}, function(data){
    	$scope.stAccts=$.parseJSON(data.childNodes[0].innerHTML);
    });
});