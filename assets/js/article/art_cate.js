$(function() {
    getArtList();
    // 获取列表数据
    function getArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取图书分类失败！');
                }

                const htmlStr = template('tpl-table', res);
                // 把数据渲染到页面
                $('tbody').html(htmlStr);
            }
        })
    };

    // 为添加类别按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        })
    });

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            data: $(this).serialize(),
            url: '/my/article/addcates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('res.message');
                }

                layer.msg('添加成功！');
                getArtList();
                layer.close(indexAdd);
            }
        })
    });

    // 通过 事件委派的形式，为 btn-edit 按钮绑定点击事件
    let indexEdit = null;
    const form = layui.form;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '修改了文章分类',
            content: $('#dialog-edit').html(),
        });

        const id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    });

    // 通过 事件委派 的方式，给修改按钮绑定点击事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！');
                }

                layer.msg('更新数据成功！');
                layer.close(indexEdit);
                getArtList();
            }
        })
    });

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        const id = $(this).attr('data-id');

        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function() {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    getArtList();
                }
            })
        })
    })
})