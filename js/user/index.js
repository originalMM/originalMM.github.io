$(function () {

    getUserIndexData(function (data) {
        console.log(data);
        var mobile = data.mobile || '暂无';
        $('.mui-media-body').html(data.username+'<p class="mui-ellipsis">'+data.mobile+'</p>');

    })

    $('body').on('tap', '.btn_outLogin', function () {
        getLogOutData(function (data) {
            if (data.success) {
                location.href = CT.loginUrl;
            }
        })
    })
});


var getUserIndexData = function (callback) {
    CT.loginAjax({
        type:'get',
        url:'/user/queryUserMessage',
        data:'',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
};


var getLogOutData = function (callback) {
    CT.loginAjax({
        type: 'get',
        url:'/user/logout',
        data: '',
        dataType: 'json',
        beforeSend: function () {
            $('.btn_outLogin').html('正在退出。。。');
        },
        success:function (data) {
            callback && callback(data);
        }
    })
}