$(function() {
    // 登录注册的按需切换
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义校验规则
    // 从 layUI 中获取 form对象
    const form = layui.form;
    const layer = layui.layer;

    // 自定义了一个叫做 pwd 的校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function(value) {
            const pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次密码不一致!';
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault();
        // 2. 发起ajax的POST请求
        const data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val(), };

        $.post('/api/reguser', data, function(res) {
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message + '请登录！');
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#form-login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // serialize() 快速获取表单里面的数据  并且以查询字符串的格式把数据传给服务器
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登陆成功！');
                // console.log(res.token);
                // 把登录成功以后服务器返回的token数据保存到本地
                localStorage.setItem('token', res.token);
                // 跳转到index页面
                location.href = '/index.html';
            }
        })
    })
})