$(function() {
    const form = layui.form;
    form.verify({
        // 校验规则
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    });

    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res.data);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    };

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止按钮提交的默认行为
        e.preventDefault();
        initUserInfo();
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新用户信息成功！');
                window.parent.getUserInfo();
            }
        })
    })
})