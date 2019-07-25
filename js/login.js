$(function () {

    $('#submit').on('tap', function () {

        // 1. 获取表单序列化数据  需要有name attr
        var data = $('form').serialize();
        // 将 key=value&key=value 数据转换为对象
        var dataObject = CT.serialize2object(data);
        console.log(dataObject);

        // 校验
        if (!dataObject.username) {
            mui.toast('请输入用户名');
            return false;
        }
        if (!dataObject.password) {
            mui.toast('请输入免密');
            return false;
        }
        $.ajax({
            type:'post',
            url:'/user/login',
            dataType:'json',
            data:dataObject,
            success: function (data) {
                // 如果成功 根据地址跳转
                // 如果没有地址 默认跳转个人中心首页
                console.log(data);
                if (data.success == true) {
                    let returnUrl = location.search.replace('?returnUrl=', '');
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = CT.userUrl;
                    }
                } else {
                    //业务不成功
                    mui.toast(data.message);
                }
            }

        });
    });




});