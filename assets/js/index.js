$(function() {
    getUserInfo();

    // 点击按钮，实现退出功能
    // const layer = layui.layer;

    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';

            layer.close(index);
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.token || '',
        // },
        success(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data);
        },
        // complete: function(response) {
        //     console.log(response);
        //     const res = response.responseJSON;
        //     if (res.status === 1 && res.message === '身份认证失败！') {
        //         // 说明没有权限
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户名
    const name = user.nickname || user.username;
    $('#welcome').html(`欢迎 ${name}`);

    // 处理文字头像和图片头像
    if (user.user_pic) {
        // 图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 文字头像
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}