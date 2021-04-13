$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $('#chooseImg').on('click', function() {
        $('#file').click();
    });

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
        const [file] = e.target.files;
        // const file = e.target.files[0];
        if (!file) return layer.msg('请选择照片！');

        // 文件存在
        const imgUrl = URL.createObjectURL(file);

        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 为确定按钮，绑定点击事件
    $('#btnUpload').on('click', function() {
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('上传失败！');
                }

                layer.msg('上传成功！');
                window.parent.getUserInfo();
            }
        })
    })
})