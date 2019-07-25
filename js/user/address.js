
$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
    });
    // getAddressData(function (data) {
    //     $('.mui-scroll').html(template('addressTpl',{model:data}));
    // })
    renderAddress();
    $('body').on('tap', '.mui-btn-red', function () {
        deleteAddress($(this).attr('data-id'), function () {
            mui.toast('删除成功!!');
            // getAddressData(function (data) {
            //     $('.mui-scroll').html(template('addressTpl',{model:data}));
            // });
            renderAddress();
        })
    }).on('tap', '.addMore', function () {
        console.log(window.data);
        if (!window.data || window.data.length < 5) {
            window.location.href = 'addressManager.html';
        } else {
            setInterval(function () {
                mui.toast('最多添加5条地址');
                return false;
            }, 10);
        }
    });

    function renderAddress() {
        getAddressData(function (data) {
            window.data = data;
            $('.mui-scroll').html(template('addressTpl',{model:data}));
        })
    }
});


var getAddressData = function(callback) {
    setInterval(function () {
        CT.loginAjax({
            type:'get',
            url:'/address/queryAddress',
            data:{},
            dataType:'json',
            success: function (data) {
                callback && callback(data);
            }
        })
    }, 1000);

}

var deleteAddress = function(id,callback){
    CT.loginAjax({
        type:'post',
        url:'/address/deleteAddress',
        data:{id:id},
        dataType:'json',
        success:function(data){
            callback && callback(data);
        }
    });
};