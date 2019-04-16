(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$
            ,form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate
            ,upload = layui.upload
            ,element = layui.element;


        var uploadInst = upload.render({
            elem: '#test1',
            url: global_path + "/manage/user/fileUpLoad",
            headers: {
                'at': at
            },
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    $('#demo1').attr('src', result); //图片链接（base64）
                });
                var file = sessionStorage.getItem('file');
                if(file){
                    file = JSON.parse(file).data;
                    // requestType  文件为0，图片为1
                    this.data = {
                        'filename':file.filename + '.' + file.suffix,
                        'requestType':'1'
                    }
                }else{
                    this.data = {
                        'requestType':'1'
                    }
                }
                
            },
            done: function (res) {
                //如果上传成功
                if (res.code == 0) {
                    sessionStorage.setItem('file',JSON.stringify(res));
                    return layer.msg('上传成功');
                }else if(res.code == 401){
                    unauthorized(res.code);
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
        //表单初始赋值
        var HTlogin = sessionStorage.getItem('HTlogin');
        if(HTlogin){
            HTlogin = JSON.parse(HTlogin);
            form.val("example", {
                "username": HTlogin.data.username // "name": "value"
                ,"realName": HTlogin.data.realName
                ,"dept": HTlogin.data.dept
                ,"telephone": HTlogin.data.telephone
            })
            $('#demo1').attr('src',HTlogin.data.url);
        }
        form.on('submit(demo1)', function (data) {
            var file = sessionStorage.getItem('file');
            var realName = $('.realName').val();
            var username = $('.username').val();
            var dept = $('.dept').val();
            var telephone = $('.telephone').val();
            if(username == ''){
                alert('请输入用户名');
                return;
            }else if(realName == ''){
                alert('请输入姓名');
                return;
            }else if(dept == ''){
                alert('请输入用户部门');
                return;
            }else if(telephone == ''){
                alert('请输入用户电话');
                return;
            }else{
                var parms = {
                    'realName':data.field.realName,
                    'username':data.field.username,
                    'dept':data.field.dept,
                    'telephone':data.field.telephone,
                    'id':HTlogin.data.id
                }
                if(file){
                    file = JSON.parse(file).data;
                    parms.filename = file.filename;
                    parms.filetype = file.filetype;
                    parms.suffix = file.suffix;
                    parms.url = file.url;
                }
                var url = global_path + "/manage/user/editPersonalInfo";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        HTlogin.data.realName = parms.realName;
                        HTlogin.data.username = parms.username;
                        HTlogin.data.password = parms.password;
                        HTlogin.data.dept = parms.dept;
                        HTlogin.data.telephone = parms.telephone;
                        HTlogin.data.url = file.url;
                        sessionStorage.setItem('HTlogin',JSON.stringify(HTlogin));

                        parent.layer.msg(data.msg);
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                        parent.layer.close(index);

                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
    });
})();

