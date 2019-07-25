window.CT = {};
CT.getParamsByUrl = function() {
    let params = {};
    let search = location.search;
    if (search) {
        // search.splice(0, 1);
        search = search.replace('?', '');
        let arr = search.split('&');
        arr.forEach(function (item, index) {
            let itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
        });
    };
    return params;
};

CT.serialize2object = function(serializeStr){
    let obj = {};
    if (serializeStr) {
        let arr = serializeStr.split('&');
        arr.forEach(function (item, index) {
            var itemArr = item.split('=');
            obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
};

// 需要登录的ajax请求
CT.loginUrl = '/m/user/login.html';
CT.cartUrl = '/m/user/cart.html';
CT.userUrl = '/m/user/index.html';


CT.loginAjax = function (params) {
    $.ajax({
        url: params.url || '#',
        type:params.type || 'get',
        data:params.data || '',
        dataType: params.dataType || 'json',
        beforeSend:params.beforeSend,
        success: function (data) {
            // 未登录的处理
            if (data.error == 400) {
                // 去登录页面
                location.href = CT.loginUrl + '?returnUrl='+location.href;
                return false;
            } else {
                params.success && params.success(data);
            }

        },
        error: function () {
            mui.toast('服务器繁忙');
            return false;
        }

    });
}

CT.getIndexFromId = function(arr, id) {
    var index = null;
    for(var i = 0; i< arr.length; i ++) {
        var item = arr[i];
        if(item && item.id == id) {
            index = i;
            break;
        }
    }
    return index;
}

CT.getObjectFromId = function(arr, id) {
    var object = null;
    for(var i = 0; i< arr.length; i ++) {
        var item = arr[i];
        if(item && item.id == id) {
            object = item;
            break;
        }
    }
    return object;
}