$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示几条数据，默认2条
        cate_id: '', //文章的 Id
        state: '', // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var hh = dt.getHours();
        hh = hh > 9 ? hh : '0' + hh;
        var mm = dt.getMinutes();
        mm = mm > 9 ? mm : '0' + mm;
        var ss = dt.getSeconds();
        ss = ss > 9 ? ss : '0' + ss;
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id').html(htmlStr);
                // 通知 layui 重新渲染表单区域 ui 结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 为查询参数对象 q 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage render() 方法渲染分页结构

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  // 注意，这里的 test1 是 ID，不用加 # 号
            count: total,     // 数据总数，从服务端得到
            limit: q.pagesize,  // 每页显示多少条数据
            curr: q.pagenum, // 设置默认被选中的分页页码值
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // jump 分页发生切换时执行回调
            // 1.点击页码触发回调
            // 2.只要调用了 laypage.render() 方法就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值来判断是通过哪种方式触发的 jump
                // 如果是 first 值为 true，就是调用 render（） 触发
                // 如果 first 值为 false 就是手动点击触发

                // 最新页码值赋值到 q 查询参数中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到 q
                q.pagesize = obj.limit
                // 更具最新的 q 获取对应数据列表渲染表格
                if (!first) {
                    initTable();
                }
            }
        });
    };


    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮个数
        var len = $('.btn-delete').length;
        // 获取到文章的id
        console.log($(this));
        var id = $(this).attr('data-id');
        // 询问用户是否删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg("删除文章成功！");
                    // 当数据删除完成后需要判断当前页中是否还有数据
                    // 如果没有数据了，则让页码值 -1 之后在调用 initTable()
                    if (len === 1) {
                        // 如果 len 值等于1 说明删除完毕之后，页面就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        initTable();
                    }
                }
            })
            layer.close(index)
        })
    })


})