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
            HTlogin = JSON.parse(HTlogin);
            form.val("example", {
                "username": HTlogin.data.username // "name": "value"
                ,"realName": HTlogin.data.realName
                ,"dept": HTlogin.data.dept
                ,"telephone": HTlogin.data.telephone
            })
        }
        form.on('submit(demo1)', function (data) {
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
                var url = global_path + "/manage/user/editPersonalInfo";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        HTlogin.data.realName = parms.realName;
                        HTlogin.data.username = parms.username;
                        HTlogin.data.password = parms.password;
                        HTlogin.data.dept = parms.dept;
                        HTlogin.data.telephone = parms.telephone;
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

