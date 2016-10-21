app.filter('orderStatusFilter', function($translate) {
	    return function(key) {
	    	key='common_status_tran_'+key;
	    	var  value=$translate.instant(key);
	      	return value;
	  }
});

app.filter('merchantStatusFilter', function($translate) {
	    return function(key) {
	    	key='common_status_merchant_'+key;
	    	var  value=$translate.instant(key);
	      	return value;
	  }
});

app.filter('rateVerifyStatusFilter', function($translate) {
	    return function(key) {
	        key='common_status_approve_'+key;
	    	var  value=$translate.instant(key);
	      	return value;
	  }
});

app.filter('toUpperCase', function() {
	    return function(key) {
	      return key.toUpperCase();
	  }
});

app.filter('tradeState', function() {
	    return function(key) {
	    	dic=['待处理', '处理中', '已处理', '已执行'];
	      	return dic[key];
	  }
});


app.filter('lockStatusFilter', function($translate) {
	    return function(key) {
	    	var s=key?'1':'2';
	    	key='common_status_user_'+s;
	    	var  value=$translate.instant(key);
	      	return value;
	  }
});

app.filter('dateFormatFilter', function() {
	    return function(key) {
	    	//key="2015-07-31T17:37:39.607"
	    	var value='';
	    	if(key==null || key==''){
	    		value='';
	    	}else if(key!=null && key.indexOf('.')>0 ){
	    		//2015-08-11 14:34:17.667=>2015-08-11 14:34:17
	    		value=key.substring(0, key.indexOf('.'));
	    	}else if(key.length==14){
	    		value=key.substring(0, 4)+'-'+key.substring(4,6)+'-'+key.substring(6,8)
	    			+' '+key.substring(8,10)+':'+key.substring(10,12)+':'+key.substring(12,14);
	    	}else{
	    		value=new Date(key).toLocaleDateString();
	    	}

	    	if(value!=null && value.indexOf('T')>0){
	    		value=value.replace('T', ' ');
	    	}
	      return value;
	  }
});

app.filter('toFixedFilter', function() {
	    return function(key) {
	    	var value=new Number(key);
	      return value.toFixed(4);
	  }
});

app.filter('dateFormat', function () {
    return function (key) {
        var value = new Date(key);
        return value.getFullYear() + "-" + (value.getMonth()+1) + "-" + value.getDate();
    }
});

app.filter('isRun', function () {
    return function (key) {
        var value = "common_btn_notRun";
        if (key) {
            value = "common_btn_run";
        }

        return value;
    }
});

app.filter('settlementDateStatus', function () {
    return function (key) {
        var value = "clr_unexpired";
        if (key) {
            value = "clr_expired";
        }

        return value;
    }
});

app.filter('isSealed', function () {
    return function (key) {
        var value = "reconcile_UnSealed";
        if (key) {
            value = "reconcile_Sealed";
        }

        return value;
    }
});

//²îÒìÀàÐÍ×Öµä
app.filter('differenceType', function () {
    return function (key) {
        var value = "";

        switch (key) {
            case "0":
                value = "diff_type_0";
                break;

            case "1":
                value = "diff_type_1";
                break;

            case "2":
                value = "diff_type_2";
                break;

            case "3":
                value = "diff_type_3";
                break;
            
            default:
                value = "diff_type_4";
        }

        return value;
    }
});