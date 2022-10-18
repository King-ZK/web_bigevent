$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initActCateList()

    // 获取文章分类列表
    function initActCateList() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
            }
        })
    }

    // 未添加类别按钮绑定点击事件（layui 弹出层）
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理形式为 form-add 绑定 submit 事件
    $('body').on('submit', '#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg('新增分类失败！');
                }else{
                    initActCateList();
                    layer.msg("新增分类成功!");
                }
                
                // 根据索引关闭对应弹出层
                layer.close(indexAdd);
                indexAdd = null;
            }
        })
    })

    var indexEdit = null;
    // 通过代理形式为 btn-edit 绑定点击事件
    $('tbody').on('click','.btn-edit',function(e){
        // 修改一个修改为文章
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res){
                form.val('form-edit',res.data);
            }
        })
    })

    // 通过代理形式为 form-edit 绑定 submit 事件
    $('body').on('submit', '#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }else{
                    initActCateList();
                    layer.msg('更新分类数据成功！');
                }
                // 根据索引关闭对应弹出层
                layer.close(indexEdit);
                indexEdit = null;
            }
        })
    })

    // 通过代理形式为为删除按钮绑定点击事件
    $('tbody').on('click','.btn-del',function(){
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initActCateList();
                }
            })
          });
    });
})