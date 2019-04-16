(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$,
            form = layui.form,
            element = layui.element,
            layer = layui.layer,
            upload = layui.upload,
            layedit = layui.layedit,
            laydate = layui.laydate;
        var HTlogin = sessionStorage.getItem('HTlogin');
        if(HTlogin){
            var at = JSON.parse(HTlogin).data.token;
        }
       // 上传文件
        var uploadInst = upload.render({
            elem: '#test1',
            accept: 'file',
            exts: 'jpg|png|bmp|gif|jpeg|doc|docx|xls|xlsx|zip|rar|arj|z|pdf|ppt|pptx|txt',
            // size: 
            url: global_path + "/manage/user/fileUpLoad",
            headers: {
                'at': at
            },
            before: function (obj) {
                var file = sessionStorage.getItem('file');
                if(file){
                    file = JSON.parse(file).data;
                    this.data = {
                        'filename':file.filename + '.' + file.suffix
                    }
                }
                
            },
            done: function (res) {
                //如果上传成功
                if (res.code == 0) {
                    sessionStorage.setItem('file',JSON.stringify(res));
                    return layer.msg('上传成功');
                }else{
                    return layer.msg('上传失败');
                }
                //上传失败
            },
            error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });
        form.on('submit(demo1)', function (data) {
            var file = sessionStorage.getItem('file');
            var version = $('.version').val();
            var versionInfo = $('.versionInfo').val();
            if(!file){
                alert('请上传文件');
                return;
            }else if(version == ''){
                alert('请输入版本号');
                return;
            }else if(versionInfo == ''){
                alert('请输入版本信息');
                return;
            }else{
                var parms = {
                    'version':data.field.version,
                    'versionInfo':data.field.versionInfo,
                }
                if(file){
                    file = JSON.parse(file).data;
                    parms.filename = file.filename;
                    parms.filetype = file.filetype;
                    parms.suffix = file.suffix;
                    parms.url = file.url;
                }
                var url = global_path + "/manage/version/insertVersionInfo";
                commonAjax(url,parms,function(data){
                    
                    if(data.code == 0){
                        
                        sessionStorage.removeItem('file');
                        parent.layer.msg(data.msg);
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                        parent.layer.close(index);

                    }else if(data.code == 401){
                        unauthorized(data.code);
                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
    });
})();

