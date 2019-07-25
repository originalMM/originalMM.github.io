mui('.mui-scroll-wrapper').scroll({
    indicators: false
});



$(function () {

    // 获取地址栏关键字初始化页面

    var urlParams = CT.getParamsByUrl();

    let key = urlParams['key'] || "";
    $('.search_input').val(key);

    // 已经有下拉刷新配置中 进入页面自动刷新了
    // getSearchData({
    //     proName:key,
    //     page:1,
    //     pageSize:4
    // }, function (data) {
    //     $('.ct_product').html(template('list', data));
    // });

    // 点击搜索页面
    $('.ct_search form').on('tap', '.search_btn', function () {
        var key = $.trim($('input').val());
        if (!key){
            mui.toast('请输入关键字');
            return false;
        }
        mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
        getSearchData({
            proName:key,
            page:1,
            pageSize:4
        }, function (data) {
            $('.ct_product').html(template('list', data));
        });
    })

    // 点击排序按钮
    $('.ct_order a').on('tap', function () {
        let $this = $(this);
        let value = 1;
        if (!$this.hasClass('now')) {
            $this.addClass('now').siblings().removeClass('now').find('span').removeClass('fa-angel-up').addClass('fa-angle-down');

        } else {
            if ($this.find('span').hasClass('fa-angle-down')){
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
                value = 1;
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                value = 2;
            }
        }
        let order = $this.attr('data-type');

        let key = $.trim($('input').val());
        if (!key){
            mui.toast('请输入关键字');
            return false;
        }

        mui('.mui-scroll-wrapper').pullRefresh().refresh(true);

        let params = {
            proName:key,
            page:1,
            pageSize:4,
        };
        params[order] = value;
        getSearchData(params, function (data) {
            $('.ct_product').html(template('list', data));
        });
    })


    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",
            down : {
                style:'circle',
                // color:'#006699', //可选，默认“#2BD009” 下拉刷新控件颜色
                // height:'50px',//可选,默认50px.下拉刷新控件的高度,
                // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                auto: true,
                callback :function () {
                    // that 组件对象
                    var that = this;
                    let key = $.trim($('input').val());
                    if (!key){
                        mui.toast('请输入关键字');
                        that.endPulldownToRefresh();
                        return false;
                    }
                    // 重置排序，
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData({
                        proName:key,
                        page:1,
                        pageSize:4
                    }, function (data) {
                        $('.ct_product').html(template('list', data));

                    });
                    setTimeout(function () {
                        that.endPulldownToRefresh();
                        that.refresh(true); // 重置上拉刷新
                    }, 1000);

                }
            },
            up: {
                style:'circle',
                height: 50,
                contentrefresh: '涨价加载。。。',
                contentnomore:'没有亘古的数据了',
                auto: false,
                callback :function () {
                    window.page ++;
                    // that 组件对象
                    let that = this;
                    let key = $.trim($('input').val());
                    if (!key){
                        mui.toast('请输入关键字');
                        that.endPullupToRefresh();
                        return false;
                    }

                    // 排序，功能
                    let order = $('.ct_order a.now').attr('data-type');
                    let orderValue = $('.ct_order a.now').hasClass('fa-angel-up') ? 1 : 2;

                    let params = {
                        proName:key,
                        page:window.page,
                        pageSize:4
                    };
                    params[order] = orderValue;
                    getSearchData(params, function (data) {
                        if (data.data.length) {
                            that.endPullupToRefresh();
                        }  else {
                            that.endPullupToRefresh(true);
                        }
                        $('.ct_product').append(template('list', data));

                    });

                }
            }
        }
    });




});




let getSearchData = function (params,callBack) {
    $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:params,
        dataType:'json',
        success:function (data) {
            console.log(data);
            // 当前页码
            window.page = data.page;
            setTimeout(function () {
                if (data.data.length === 0) mui.toast('没有相关商品');
                callBack && callBack(data);
            }, 1000);
        }
    });
};