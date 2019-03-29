(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$,
            form = layui.form,
            element = layui.element,
            layer = layui.layer,
            upload = layui.upload,
            layedit = layui.layedit,
            laydate = layui.laydate;
            
        var uploadInst = upload.render({
            elem: '#test1',
            url: global_path + "/fileUpLoad",
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    $('#demo1').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                if (res.code == 0) {
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
            var parms = {
                'username':data.field.username,
                'password':data.field.password,
                'role':data.field.role,
                'remarks':data.field.remarks,
                'dept':data.field.dept,
                'telephone':data.field.telephone
            }
            var url = global_path + "/addUser";
            commonAjax(url,parms,function(data){
                if(data.code == 0){
                    $('#myalert').show();
                    $('#alertConfirm').on('click','a',function(){          //保存成功弹框取消按钮
                        $('#myalert').hide();
                        window.location.href = "./operation.html";
                    });
                }else{
                    alert(data.msg);
                }
            })

        });
    });
})();

