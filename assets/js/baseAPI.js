// 每次调用 $.post / $.get / $.ajax
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function (option) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求接口的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url;

    // 统一为有权限的接口设置 headers 设置请求头
    // headers 是请求头
    if (option.url.indexOf('/my') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token')
        };
    }

    // 全局统一挂载 complete 回调函数
    // 不论成功还是失败，最终都会调用 complete 回调函数
    option.complete = function (res) {
        // 可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token (防止伪造 token)
            localStorage.removeItem('token');
            // 强制跳转登录页面
            location.href = '/login.html';
        }
    }
})
