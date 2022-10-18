$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id').html(htmlStr);
                // 一定要调用 layui.form.render()
                form.render();
            }
        })
    }


    // 初始化图片裁剪器
    var $image = $('#image');
    //  裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    }
    // 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

    })

    // 监听 coverFile 的 change 事件，获取文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 设置新的图片路径
            .cropper(options);  // 重新初始化裁剪区
    })

    // 定义文章发布状态
    var art_state = '已发布';


    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 为表单绑定 submit 点击事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于 form 表单快速创建一个 formdata 对象
        var fd = new FormData($(this)[0]);
        // 将文章发布状态存到 fd 中
        fd.append('state', art_state);
        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob){
                // 将 Canvas 画布上的内容转化为文件对象
                // 得到文件对象后进行后续操作

                // 将文件对象存储到 fd 中
                fd.append('cover_img',blob);
                 // 发起 ajax 请求
                 publishArticle(fd);
            })   
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果像服务器提交 FormData 格式数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res){
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!');
                }
                layer.msg('发布文章成功!');
                // 发布文章成功后跳转到文章列表
                location.href = '/article/art_list.html';
            }
        })
    }
})