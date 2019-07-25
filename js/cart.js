$(function () {
    mui('mui-scroll-wrapper').scroll({
        scrollY: true,
        scrollX: false,
        startX: 0,
        startY: 0,
        indicators: false,
        deceleration: 0.0006,
        bounce: true
    });

    mui.init({
        pullRefresh:{
            container: '.mui-scroll-wrapper',
            down:{
                auto: true,
                callback: function () {
                    var that = this;
                    getCartData(function (data) {
                        that.endPulldownToRefresh();
                        window.data = data;
                        console.log(data);
                        $('#cart_box').html(template('cartTpl', {model: window.data}));
                    });
                }
            }
        }
    });

    $('body').on('tap', '.mui-btn-red', function () {
        var li = this.parentNode.parentNode;
        var $this = $(this);
        mui.confirm('你要删除这件商品吗?', '温馨提示', ['确定', '取消'], function (e) {
            if (e.index == 0) {
                console.log($this);
                console.log(($this.attr('data-id')));
                deleteCartData({id:$this.attr('data-id')}, function (data) {
                    if (data.success){
                        li.parentNode.removeChild(li);
                        setAmount();
                    } else {
                        mui.toast(data.message);
                    }
                })
            } else {
                mui.swipeoutClose(li);
            }
        })
    }).on('tap', '.mui-btn-blue', function (e) {
        console.log(e);
        e.detail.gesture.preventDefault();

        var li = this.parentNode.parentNode;
        var item = CT.getObjectFromId(window.data, $(this).attr('data-id'));
        console.log(item);
        var html = template('cartUpdateTpl', {model:item}).replace(/\n/g, '');

        console.log(html);
        mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
           if (e.index == 0) {
               var params = {
                   id:item.id,
                   size:$('.mui-popup').find('.btn_size.now').html(),
                   num:$('.mui-popup').find('.p_number input').val()
               };
               if (!params.size) {
                   mui.toast('请选择尺码');
                   return false;
               }
               if (!params.num) {
                   mui.toast('请选择数量');
                   return false;
               }
               updateCartData(params, function (data) {
                   if (data.success) {
                       mui.toast('编辑成功');
                       mui.swipeoutClose(li);
                       $.extend(item, params);
                       $(li).find('.number').html('x'+params.num+'双');
                       $(li).find('.size').html('鞋码：'+params.size);
                       setAmount();
                   } else {
                       mui.toast(data.message);
                   }
               })
           } else {
               mui.swipeoutClose(li);
           }
        });
    }).on('tap', '.fa-refresh', function () {
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    }).on('tap', '.btn_size', function () {
        var $this = $(this);
        $('.btn_size').removeClass('now');
        $this.addClass('now');
    }).on('tap', '.p_number span', function () {
        var $this = $(this), $input = $('.p_number input');
        var num = parseInt($input.val()), max = $input.attr('data-max');
        if ($this.hasClass('jian')){
            num > 0 && $input.val(num-1);
        }
        if ($this.hasClass('jia')){
            if (num < max) {
                $input.val(num+1);
            } else {
                mui.toast('没有更过库存了');
            }
        }

    }).on ('change', 'input[type="checkbox"]', function () {
        setAmount();
    })

    $('.cart_order').on('tap', 'a', function () {
        mui.toast('未实现');
        return false;
    })


});

let getCartData = function (callback) {
    CT.loginAjax({
        type: 'get',
        url: '/cart/queryCart',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};

let deleteCartData = function (params, callback) {
    CT.loginAjax({
        type:'get',
        url: '/cart/deleteCart',
        dataType:'json',
        data: params,
        success: function (data) {
            callback && callback(data);
        }
    });
};

let updateCartData = function (params, callback) {
    CT.loginAjax({
        type:'post',
        url: '/cart/updateCart',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};

let setAmount = function () {
    var amount = 0;
    var checkPro = $('input:checked');
    for (var i = 0; i < checkPro.length; i++) {
        var product = CT.getObjectFromId(window.data, $(checkPro[i]).attr('data-id'));
        amount += product.price * product.num;
    }
    $('#carAmount').html(Math.ceil((amount * 100)/100));
};
