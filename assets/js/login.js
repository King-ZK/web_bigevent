$(function () {
    // 点击 "去注册账号" 的链接
    $('#link_reg').on('click', function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 点击 "登陆" 的链接
    $('#link_login').on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })


    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 verift() 自定义校验规则
    form.verify({
        // 自定义了 pwd 校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 检验两次密码是否一致的规则
        rpwd: function (value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        },
    });


    // 监听注册表单的提交行为
    $('#form_reg').on('submit', function (e) {
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功，请登录");
                $('#link_login').click();
            }
        })
    })

    // // 监听登录表单的提交行为
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/login', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg("登录失败！")
            }
            layer.msg("登陆成功！")
            // 将登录成的 token 字符串保存到 localStorage
            localStorage.setItem('token', res.token)
            // 跳转后台主页
            location.href = './index.html'
        })
    })
})