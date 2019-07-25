

$(function () {
    getProductData(CT.getParamsByUrl().productId, function (data) {
        // 清楚加载状态
        $('.loading').remove();
        $('#product_box').html(template('productTpl', {model:data}));
        // 轮播图
        mui('.mui-slider').slider({ interval:2000});

        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });

        // 尺码选择
        $('.btn_size').on('tap', function () {
            $(this).addClass('now').siblings().removeClass('now');
        });

        // 数量选择
        $('.p_number span').on('tap', function () {
            let $input = $(this).siblings('input');
            let currNum = $input.val();
            let maxNum = parseInt($input.attr('data-max'));
            if($(this).hasClass('jian')) {
                if (currNum == 0) {
                    mui.toast('数量不能为0');
                    return false;
                }
                currNum --;
            }
            if($(this).hasClass('jia')){
                // 不超数
                if (currNum == maxNum) {
                    setTimeout(function () {
                        mui.toast('已到最大库存');
                    }, 10);
                    // mui.toast('已到最大库存');
                    return false;
                }
                currNum ++;
            }
            $input.val(currNum);
        });
        // 加入购物车
        $('.btn_addCart').on('tap', function () {
            // 数据校验
            // 判断数量
            let $changeBtn = $('.btn_size.now');
            if (!$changeBtn.length) {
                setTimeout(function () {
                    mui.toast('请选择尺码');
                }, 10);
                return false;
            }
            let currNum = $('.p_number input').val();
            if (currNum == 0) {
                setTimeout(function () {
                    mui.toast('请选择数量');
                }, 10);
                return false;
            }
            // 提交数据

            CT.loginAjax({
                url: '/cart/addCart',
                type:'post',
                data:{
                    productId: CT.getParamsByUrl().productId,
                    num: currNum,
                    size: $changeBtn.html()
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        setTimeout(function () {
                            // mui.toast('加入购物车成功');
                            let btnArray = ['继续购物', '去购物车'];
                            mui.confirm('添加成功,去购物车看看？', '温馨提示', btnArray, function(e) {
                                if (e.index == 0) {
                                    console.log(e);
                                } else {
                                    console.log(e)
                                    location.href = CT.cartUrl;
                                };

                            })

                        }, 10);
                        return false;
                    }
                }

            });

        });

        $('.btn_pay').on('tap', function () {
            mui.toast('未实现');
            return false;
        })
    });
});


var getProductData = function (productId, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data:{id: productId},
        dataType: 'json',
        success: function (data) {
            console.log(data);
            setTimeout(function () {
                callback && callback(data);
            }, 1000);
        }
    })
}