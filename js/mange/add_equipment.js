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
            exts: 'txt',
            url: global_path + "/manage/user/fileUpLoad",
            before: function (obj) {
                this.data = {
                    'at':at
                }
            },
            done: function (res) {
                //如果上传失败
                if (res.code == 0) {
                    sessionStorage.setItem('fileId',res.data);
                    return layer.msg('上传成功');
                }else{
                    return layer.msg('上传失败');
                }
                //上传成功
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
            var fileId = sessionStorage.getItem('fileId');
            var version = $('.version').val();
            var versionInfo = $('.versionInfo').val();
            if(!fileId){
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
                var url = global_path + "/manage/version/insertVersionInfo";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){       //保存成功弹框取消按钮
                            sessionStorage.removeItem('fileId');
                            $('#myalert').hide();
                            window.location.href = "./mange.html?modular=upgrade";
                        });
                    }else if(data.code == 401){
                        unauthorized(data.code);
                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
        form.on('submit(demo2)', function (data) {
            sessionStorage.removeItem('fileId');
            window.location.href = "./mange.html?modular=upgrade";
        });
    });
})();

