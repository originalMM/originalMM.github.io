

$(function () {
    // 获取历史记录渲染列表
    var historyList = getHistoryData();


    $('.ct_history').html(template('historyTpl', {list:historyList}));

    mui('.ct_history_ul_scroll').scroll({
        indicators:false
    });

    $('.search_input').val('');
    // 点击搜索
    $('.search_btn').on('tap', function () {
        var key = $.trim($('.search_input').val());
        if(!key) {
            mui.toast('请输入关键字');
            return false;
        }
        var arr = getHistoryData();
        var isHave = false;
        var haveIndex ;
        for (var i = 0; i < arr.length; i++) {
            if (key == arr[i]) {
                isHave = true;
                haveIndex = i;
                break;
            }
        }
        if (isHave) {
            arr.push(key);
            arr.splice(haveIndex,1);
        } else {
            if (arr.length < 10) {
                arr.push(key);
            } else {
                arr.push(key);
                // arr.splice(0, 1);
            }
        }
        localStorage.setItem('leTaoHistory', JSON.stringify(arr));
        location.href = 'searchList.html?key='+key;
    });

    // 删除记录
    $('.ct_history').on('tap', '.mui-icon', function () {
        console.log('delete');
        var index = $(this).attr('data-index');
        var arr = getHistoryData();
        arr.splice(index, 1);
        localStorage.setItem('leTaoHistory', JSON.stringify(arr));
        $('.ct_history').html(template('historyTpl', {list:arr}));
    });
    // 清空记录
    $('.ct_history').on('tap', '.fa', function () {
        localStorage.setItem('leTaoHistory', '');
        $('.ct_history').html(template('historyTpl', {list:[]}));
    })
});


// 获取存储数据
let getHistoryData = function () {
    var str = localStorage.getItem('leTaoHistory') || '[]';
    var arr = JSON.parse(str);
    return arr;
}