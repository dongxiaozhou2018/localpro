(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element",'tree'], function(){
        var $ = layui.$
            ,form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate
            ,upload = layui.upload
            ,element = layui.element
            ,tree = layui.tree;
        var HTlogin = sessionStorage.getItem('HTlogin');
        if(HTlogin){
            var at = JSON.parse(HTlogin).data.token;
        }
        var uploadInst = upload.render({
            elem: '#test1',
            url: global_path + "/manage/user/fileUpLoad",
            headers: {
                'at': at
            },
            acceptMime: 'image/*',
            accept: 'images',
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
                }else if(res.code == -1){
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
        var checkUser = sessionStorage.getItem('checkUser');
        if(checkUser){
            checkUser = JSON.parse(checkUser).data;
            form.val("example", {
                "realName": checkUser.realName
                ,"username": checkUser.username // "name": "value"
                ,"password": checkUser.password
                ,"role": checkUser.role
                ,"dept": checkUser.dept
                ,"telephone": checkUser.telephone
                ,"remarks": checkUser.remarks
            })
        }
        form.on('submit(demo1)', function (data) {
            var file = sessionStorage.getItem('file');
            var username = $('.username').val();
            var realName = $('.realName').val();
            var role = $('.role').val();
            var dept = $('.dept').val();
            var telephone = $('.telephone').val();
            var remarks = $('.remarks').val();
            var password = $('.password').val();

            if(username == ''){
                alert('请输入用户名');
                return;
            }else if(realName == ''){
                alert('请输入姓名');
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
                    'realName':data.field.realName,
                    'username':data.field.username,
                    'role':data.field.role,
                    'remarks':data.field.remarks,
                    'dept':data.field.dept,
                    'telephone':data.field.telephone
                }
                if(getQueryString('ID')){
                    parms.id = getQueryString('ID');
                }
                if(file){
                    file = JSON.parse(file).data;
                    parms.filename = file.filename;
                    parms.filetype = file.filetype;
                    parms.suffix = file.suffix;
                    parms.url = file.url;
                }
                if(getQueryString("type") == 'update'){

                    var url = global_path + "/manage/user/updateUser";

                }else if(getQueryString("type") == 'add'){
                    if(password == ''){
                        parms.password = $.md5('111111');
                    }else{
                        parms.password = $.md5(password);
                    }
                    var url = global_path + "/manage/user/addUser";

                }
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        sessionStorage.removeItem('checkUser');
                        sessionStorage.removeItem('file');

                        parent.layer.msg(data.msg);
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                        parent.layer.close(index);
                    }else if(data.code == -1){
                        unauthorized(data.code);
                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
        
    });
    
})();

