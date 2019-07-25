$(function () {
    var cityPicker = new mui.PopPicker({layer:3});
    cityPicker.setData(cityData);

    var addressId = location.search;
    addressId = addressId && addressId.split('=');
    addressId = addressId && addressId[1];
    if (addressId) {
        $('header .title').html('修改收货地址');
        getAddressData(function (data) {
            var detail = CT.getObjectFromId(data, addressId);
            $('[name="recipients"]').val(detail.recipients);
            $('[name="postCode"]').val(detail.postCode);
            $('[name="address"]').val(detail.address);
            $('[name="addressDetail"]').val(detail.addressDetail);
        });
    } else {
        $('header .title').html('添加收货地址');
    }


    $('body').on('tap', '.btn_submit', function () {
        var dataStr = $('form').serialize('urt-8');
        dataStr = decodeURIComponent(dataStr,true);
        let data = CT.serialize2object(dataStr);
        if(!data.recipients){
            mui.toast('请输入收货人');
            return false;
        }

        if(!data.postCode){
            mui.toast('请输入邮编');
            return false;
        }

        if(!/^\d{6}$/.test(data.postCode)){
            mui.toast('请输入合法邮编');
            return false;
        }

        if(!data.address){
            mui.toast('请选择省市区');
            return false;
        }

        if(!data.addressDetail){
            mui.toast('请输入详细地址');
            return false;
        }
        data.postcode = data.postCode;

        var editUrl = '/address/addAddress';
        var tip = '添加';
        if (addressId) {
            editUrl = '/address/updateAddress';
            tip = '修改';
            data.id = addressId;
        }

        editAddress(data, editUrl, function () {
            mui.toast(tip + '成功');
            location.href = 'address.html';
        });
    }).on('tap', '[name="address"]', function () {
        cityPicker.show(function (items) {
            if (items[0].text == items[1].text) {
                items[0].text = '';
            }
            console.log($(this));
            $('[name="address"]').val(items[0].text+' '+items[1].text+' '+(items[2].text || ''));
        })
    })
})



let editAddress = function (data, url, callback) {
    CT.loginAjax({
        type: 'post',
        url:url,
        data: data,
        dataType:'json',
        beforeSend: function () {
            $('.btn_submit').html('正在提交');
        },
        success: function (data) {
            callback && callback(data);
        },
        error: function () {
            $('.btn_submit').html('提交');
        }
    })
}

let getAddressData = function (callback) {
    CT.loginAjax({
        url:'/address/queryAddress',
        daa:{},
        success: function (data) {
            callback && callback(data);
        }
    })
}