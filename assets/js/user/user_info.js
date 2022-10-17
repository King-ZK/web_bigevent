$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nckname: function (value) {
            if (value.length > 8) {
                return '昵称长度必须在 1 ~ 8 个字符之间！';
            }
        }
    })

    initUserInfo(form);

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单全部清空
        e.preventDefault();
        initUserInfo(form);
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!');
                }
                layer.msg("更新用户信息成功!");
                // 调用父页面 index.html 中的方法重新渲染页面头像
                // iframe标签 为子页面
                window.parent.getUserInfo();
            }
        })
    })

    // 初始化用户的基本信息
    function initUserInfo(form) {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)

            }
        })
    }
})


