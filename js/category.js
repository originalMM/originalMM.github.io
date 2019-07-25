mui('.cate_left').scroll({
    indicators:false
});
var scrollRight = mui('.cate_right').scroll({
    indicators:false
});

$(function () {
    // 一级分类 默认渲染  第一个一级分类对应的二级分类
    getCategoryData(function (data) {
        // 模板的使用顺序
        data.rows = data.rows.concat(data.rows);
        console.log(data);

        // 1. json数据  2. 定义模板 调用模板
        $('.cate_left ul').html(template('firstTemplate', data));
        // 绑定事件
        // initsecondTapHandle()
        let categoryId = $('.cate_left ul li:first-child').attr('data-id');
        // 二级分类
        render(categoryId);
    });

    // 点击一级分类加载对应的二级分类
    // 方案一
    // var initsecondTapHandle = function () {
    //     $('.cate_left li').on('tap', function () {
    //         console.log('tap');
    //     })
    // }
    // 方案二
    $('.cate_left').on('tap', 'li', function (e) {
        if ($(this).hasClass('now')) return false;

        $('.cate_left li').removeClass('now');
        $(this).addClass('now');

        let categorId = $(this).attr('data-id');
        render(categorId);
    });


});
// 获取一级分类数据
let getCategoryData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:{},
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    })
};

let cateClick = function(id) {
    let param = {'id':id}
    getSecondCategoryData(param, function (data) {
        console.log(data);
        $('.cate_right ul').html(template('secondTemplate', data));
    });
};
// 获取二级分类数据
let getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    })
};
// 渲染二级分类方法
let render = function (categoryID) {
    let param = {'id':categoryID}
    getSecondCategoryData(param, function (data) {
        data.rows = data.rows.concat(data.rows);
        data.rows = data.rows.concat(data.rows);
        data.rows = data.rows.concat(data.rows);
        console.log(data);
        $('.cate_right ul').html(template('secondTemplate', data));
    });
}
