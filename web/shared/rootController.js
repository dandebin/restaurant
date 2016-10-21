//var app=angular.module('app', ['ngRoute', 'ngResource']); 
app.controller('rootCtr', function($scope, service, $localStorage, $sessionStorage,  $translate){
	
  	$scope.features=[];
  	$scope.currentFeature={};
  	$scope.currentSubFeature={};
  	$scope.featureIcons=['icon-cogs', 'icon-user', 'icon-table', 'icon-th', 'icon-briefcase', 'icon-file-text', 'icon-bar-chart', 'icon-folder-open'];
  	$scope.userInfo = service.getUserFromLocale();
  	$scope.roleName='';
  	$scope.init=function(){   	  
  		if($scope.userInfo==null || $scope.userInfo=='' || $scope.userInfo.userName==null){
  			location.href='login/admin.html';
  		}

      service.invokePost('GetFeatures', {name: $scope.userInfo.userName}, function(data){
        $scope.features=$.parseJSON(data.childNodes[0].innerHTML);
      });

      /*
      $scope.features=[
        {
          FeatureId:1, Name:'外汇账户', Url:'#account/detail', ParentFeatureId:0, 
            SubFeatures:
            [
              {FeatureId:2, Name:'账户1', Url:'#account/detail', ParentFeatureId:1},
              {FeatureId:2, Name:'账户2', Url:'#account/detail', ParentFeatureId:1},
            ] 
        },
        {
          FeatureId:1, Name:'期货账户', Url:'#', ParentFeatureId:0, 
            SubFeatures:
            [
              {FeatureId:2, Name:'账户1', Url:'#account/detail', ParentFeatureId:1},
              {FeatureId:2, Name:'账户2', Url:'#account/detail', ParentFeatureId:1},
            ] 
        },
        {
          FeatureId:1, Name:'股票账户', Url:'#', ParentFeatureId:0, 
            SubFeatures:
            [
              {FeatureId:2, Name:'账户1', Url:'#account/detail', ParentFeatureId:1},
              {FeatureId:2, Name:'账户2', Url:'#account/detail', ParentFeatureId:1},
            ] 
        }
      ];
      var currentSubFeature=$scope.features[0].SubFeatures[0];
      //$scope.onClickSubFeature(currentFeature, currentSubFeature); 
      */
      /*
  	  service.getUserFeatures($scope.userInfo.userName, function(result){
  	    	if(result.IsSuccess){
  	    		$scope.features=result.Results.Features;
  	    	
            var currentFeature=JSON.parse(window.localStorage.getItem('rootCtr.currentFeature'));
            var currentSubFeature = JSON.parse(window.localStorage.getItem('rootCtr.currentSubFeature'));
            if(currentFeature!=null && currentSubFeature!=null)
            {
                $.each($scope.features, function (n, value) {
                    if(value.FeatureId==currentFeature.FeatureId)
                    {
                        currentFeature.Name = value.Name;
                        $.each(value.SubFeatures, function (s, t) {
                            if (t.FeatureId == currentSubFeature.FeatureId) {
                                currentSubFeature.Name = t.Name;
                                return false;
                            }
                        });                    
                    }
                });
            }

            $scope.onClickSubFeature(currentFeature, currentSubFeature); 
  	    	}else{
  	    		alert(result.ErrorMessage);
  	    	}  	    
  	  });
      */

    }  	

  	$scope.logout=function(){
  		var url=$scope.userInfo.roleId!=4?'login/admin.html':'login/merchant.html';
  		service.saveUserInLocale({});
  		location.href=url;
  	}

  	$scope.onClickSubFeature=function(feature, subFeature){
  	    $("div.row-fluid > div > ul.breadcrumb").show();
  		if(feature==null || subFeature==null) return;
      if($scope.userInfo.roleId>=4 
  			&& subFeature.Url=='#/main/dashboard'){
  			return;
  		}

      if(feature.Name=='Dashboard' || feature.Name=='仪表盘' || feature.Name=='sidebar_head_dashboard'){
        feature.Name=$translate.instant('sidebar_head_dashboard');
      }

      var type='user_add_type_'+$scope.userInfo.roleId;
      $scope.roleName=$translate.instant(type);

  		$scope.currentFeature=feature;
		  $scope.currentSubFeature=subFeature;
  		window.location=subFeature.Url;

      window.localStorage.setItem('rootCtr.currentFeature', JSON.stringify($scope.currentFeature));
      window.localStorage.setItem('rootCtr.currentSubFeature',JSON.stringify($scope.currentSubFeature));
  		//hide menu
  		$('.btn-navbar').click();
  	}
  	
  	$scope.switchLang = function (lang) {
        $translate.use(lang);
        window.localStorage.lang = lang;
        $scope.cur_lang = $translate.use();
        window.location.reload();
    };

    $scope.getMessage= function(label){
       return $translate.instant(label);
    }

    jQuery(document).on("click", "a.collapse", function () {
        jQuery(this).toggleClass("expand"); var sNode = $("div.portlet-body");
        if (sNode) {
            if (sNode.length > 1) sNode.eq(0).toggle();
            else sNode.toggle();}        
    }).on("click", "ul.page-sidebar-menu > li.open > a", function () {
        jQuery(this).find("span.arrow").toggleClass("open").parent().next("ul.sub-menu").toggle();
    }).on("click", ".go-top", function () {
        jQuery('body,html').animate({ scrollTop: 0 }, 1000);
        return false;
    }).on("keydown", ".form_datetime", function () {
        $(this).datetimepicker('show');      
    });

  	$scope.init();
});
