(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$
            ,form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate
            ,upload = layui.upload
            ,element = layui.element;

        //表单初始赋值
        var HTlogin = sessionStorage.getItem('HTlogin');
        if(HTlogin){
            HTlogin = JSON.parse(HTlogin).data;
            form.val("example", {
                "nickname": HTlogin.data.nickname
                ,"username": HTlogin.data.username // "name": "value"
                ,"password": HTlogin.data.password
                ,"dept": HTlogin.data.dept
                ,"telephone": HTlogin.data.telephone
            })
        }
        form.on('submit(demo1)', function (data) {
            var nickname = $('.nickname').val();
            var username = $('.username').val();
            var password = $('.password').val();
            var dept = $('.dept').val();
            var telephone = $('.telephone').val();
            if(nickname == ''){
                alert('请输入昵称');
                return;
            }else if(username == ''){
                alert('请输入用户名');
                return;
            }else if(dept == ''){
                alert('请输入用户部门');
                return;
            }else if(telephone == ''){
                alert('请输入用户电话');
                return;
            }else{
                var parms = {
                    'nickname':data.field.nickname,
                    'username':data.field.username,
                    'password':data.field.password,
                    'dept':data.field.dept,
                    'telephone':data.field.telephone
                }
                var url = global_path + "/updateUser";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){          //保存成功弹框取消按钮
                            sessionStorage.removeItem('HTlogin')
                            $('#myalert').hide();
                            window.location.href = "./mange.html";
                        });
                    }else{
                        alert(data.msg);
                    }
                })
            }
            

        });
    });
})();

