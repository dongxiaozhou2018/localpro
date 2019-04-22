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
        
        var checkUser = sessionStorage.getItem('checkUser');
        if(checkUser){
            var id = JSON.parse(checkUser).data.id;
        }

        getAjax(global_path + "/manage/function/selectOne?id=" + id,function(res){
            
            nodenew = res.children;
            var xtree1 = new layuiXtree({
                elem: 'xtree1'   //(必填) 放置xtree的容器，样式参照 .xtree_contianer
                , form: form     //(必填) layui 的 from
                , data: nodenew     //(必填) json数据
            });
        })

        //   //表单初始赋值
        // var checkUser = sessionStorage.getItem('checkUser');
        // if(checkUser){
        //     checkUser = JSON.parse(checkUser).data;
        //     form.val("example", {
        //         "realName": checkUser.realName
        //         ,"username": checkUser.username // "name": "value"
        //         ,"password": checkUser.password
        //         ,"role": checkUser.role
        //         ,"dept": checkUser.dept
        //         ,"telephone": checkUser.telephone
        //         ,"remarks": checkUser.remarks
        //     })
        // }
        // form.on('submit(demo1)', function (data) {
        //     var file = sessionStorage.getItem('file');
        //     var username = $('.username').val();
        //     var realName = $('.realName').val();
        //     var role = $('.role').val();
        //     var dept = $('.dept').val();
        //     var telephone = $('.telephone').val();
        //     var remarks = $('.remarks').val();
        //     var password = $('.password').val();

        //     if(username == ''){
        //         alert('请输入用户名');
        //         return;
        //     }else if(realName == ''){
        //         alert('请输入姓名');
        //         return;
        //     }else if(role == ''){
        //         alert('请选择用户类型');
        //         return;
        //     }else if(dept == ''){
        //         alert('请输入用户部门');
        //         return;
        //     }else if(telephone == ''){
        //         alert('请输入用户电话');
        //         return;
        //     }else if(remarks == ''){
        //         alert('请输入用户备注信息');
        //         return;
        //     }else{
        //         var parms = {
        //             'realName':data.field.realName,
        //             'username':data.field.username,
        //             'role':data.field.role,
        //             'remarks':data.field.remarks,
        //             'dept':data.field.dept,
        //             'telephone':data.field.telephone
        //         }
        //         if(getQueryString('ID')){
        //             parms.id = getQueryString('ID');
        //         }
        //         if(file){
        //             file = JSON.parse(file).data;
        //             parms.filename = file.filename;
        //             parms.filetype = file.filetype;
        //             parms.suffix = file.suffix;
        //             parms.url = file.url;
        //         }
        //         if(getQueryString("layEvent") == 'edit'){

        //             var url = global_path + "/manage/user/updateUser";

        //         }else if(getQueryString("layEvent") == 'add'){
        //             if(password == ''){
        //                 parms.password = $.md5('111111');
        //             }else{
        //                 parms.password = $.md5(password);
        //             }
        //             var url = global_path + "/manage/user/addUser";

        //         }
        //         commonAjax(url,parms,function(data){
        //             if(data.code == 0){
        //                 sessionStorage.removeItem('checkUser');
        //                 sessionStorage.removeItem('file');

        //                 parent.layer.msg(data.msg);
        //                 window.parent.location.reload();
        //                 var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        //                 parent.layer.close(index);
        //             }else if(data.code == 401){
        //                 unauthorized(data.code);
        //             }else{
        //                 alert(data.msg);
        //             }
        //         })
        //     }
        // });
            
            
        // })
    });
    
})();

