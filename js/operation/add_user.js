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
            var username = $('.username').val();
            var password = $('.password').val();
            var role = $('.role').val();
            var dept = $('.dept').val();
            var telephone = $('.telephone').val();
            var remarks = $('.remarks').val();
            if(!fileId || fileId == ''){
                alert('请选择图片');
                return;
            }else if(username == ''){
                alert('请输入用户名');
                return;
            }else if(password == ''){
                alert('请输入用户密码');
                return;
            }else if(role == ''){
                alert('请选择用户类型');
                return;
            }else if(dept == ''){
                alert('请输入用户部门');
                return;
            }else if(telephone == ''){
                alert('请输入用户电话');
                return;
            }else if(remarks == ''){
                alert('请输入用户备注信息');
                return;
            }else{
                var parms = {
                    'username':data.field.username,
                    'password':data.field.password,
                    'role':data.field.role,
                    'remarks':data.field.remarks,
                    'dept':data.field.dept,
                    'telephone':data.field.telephone,
                    'fileId':fileId ? fileId : ''
                }
                var url = global_path + "/addUser";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){       //保存成功弹框取消按钮
                            sessionStorage.removeItem('fileId');
                            $('#myalert').hide();
                            window.location.href = "./operation.html";
                        });
                    }else{
                        alert(data.msg);
                    }
                })
            }
            

        });
    });
})();

