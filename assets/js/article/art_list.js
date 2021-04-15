$(function() {
    // // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        const year = dt.getFullYear();
        const month = addZero(dt.getMonth() + 1);
        const day = addZero(dt.getDate());

        const h = addZero(dt.getHours());
        const m = addZero(dt.getMinutes());
        const s = addZero(dt.getSeconds());

        return `${year}-${month}-${day} ${h}:${m}:${s}`;
    }

    // 定义补0函数
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    };

    // 初始化表格数据
    initTable();
    // 初始化分类数据
    initCate();
    const form = layui.form;
    const laypage = layui.laypage;

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染数据
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 在渲染表格完后调用这个方法
                renderPage(res.total);
            }
        })
    };

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 调用模板引擎渲染分类的可选项
                const htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    };

    // 给表单监听submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        const cate_id = $('[name="cate_id"]').val();
        const state = $('[name="state"]').val();

        q.cate_id = cate_id;
        q.state = state;

        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [2, 3, 4, 5],
            theme: '#faa',
            jump: function(page, first) {
                // console.log(page.curr);
                q.pagenum = page.curr;
                q.pagesize = page.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    };

    $('tbody').on('click', '.btn-delete', function() {
        const len = $('.btn-delete').length;
        // console.log(len);
        const id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    if (len === 1 && q.pagenum !== 1) {
                        q.pagenum--;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })

})