$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 拼接url
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.token || '',
        };
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(response) {
        // console.log(response);
        const res = response.responseJSON;
        if (res.status === 1 && res.message === '身份认证失败！') {
            // 说明没有权限
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})