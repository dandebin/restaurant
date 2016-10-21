app.controller('accountCtr', function($scope, service){
	$scope.trades=[];
	$scope.messages=[];
	$scope.config={};
	$scope.cmd={};
  $scope.timeout=0;
  $scope.needRefresh=true;
	$scope.order={flag:'0', direction:'0', lots:1, symbol:'10000701', price:'0.0001' };
	var id=location.hash.replace('#/account/detail?id=', '');

  	$scope.init=function(){
  		service.invokePost('GetTradeInfo', {id: id}, function(data){
      		$scope.trades=$.parseJSON(data.childNodes[0].innerHTML);
  	    });

  		service.invokePost('GetMessages', {id:id}, function(data){
  	    	$scope.messages=$.parseJSON(data.childNodes[0].innerHTML);
  	    });

  		service.invokePost('GetAccountConfig', {id:id}, function(data){
  	    	$scope.config=$.parseJSON(data.childNodes[0].innerHTML);
  	    	if($scope.config!=null && $scope.config.Cmd!=null){
  	    		$scope.cmd.started=$scope.config.Cmd[0]=='1';
  	    		$scope.cmd.buyEnabled=$scope.config.Cmd[1]=='1';
  	    		$scope.cmd.sellEnabled=$scope.config.Cmd[2]=='1';
  	    		var dic=['初始化','进行中','已处理'];
  	    		$scope.config.StateName=dic[$scope.config.State];
  	    	}
  	    });
        $scope.refresh();
  	 
    }

    $scope.onClickNeedRefresh=function(){
      if($scope.needRefresh){
          $scope.timeout=setTimeout('$scope.refresh()',5000);
      }else{
          clearTimeout($scope.timeout);
      }
    }

    $scope.refresh=function(){
       service.invokePost('GetMarketData', {id:id}, function(data){
          $scope.marketdata=$.parseJSON(data.childNodes[0].innerHTML);
      });
    }

    $scope.onSubmit=function(){
    	var cmd=$scope.cmd.started?'1':'0';
    	cmd+=$scope.cmd.buyEnabled?'1':'0';
    	cmd+=$scope.cmd.sellEnabled?'1':'0';
    	service.invokePost('UpdateAccountConfig', 
    		{	id:id, 
    			cmd:cmd, 
    			param:$scope.config.Param,
    			state:0
    		}, function(data){
	    		alert('提交成功');
	    		$scope.init();
    	});
    }

    $scope.onOrderSubmit=function(){
    	var cmd=$scope.cmd.started?'1':'0';
    	cmd+=$scope.cmd.buyEnabled?'1':'0';
    	cmd+=$scope.cmd.sellEnabled?'1':'0';
    	service.invokePost('InsertOrder', 
    		{	  BrokerId: $scope.order.brokerID,
    				Direction: $scope.order.direction,
                  Flag:$scope.order.flag ,
                  ID:id,
                  Lots:$scope.order.lots,
                  Price:$scope.order.price,
                  State:0,
                  Symbol:$scope.order.symbol,
                  Type:3
    		}, function(data){
	    		alert('提交成功');
	    		$scope.init();
    	});
    }

    $scope.init();

});