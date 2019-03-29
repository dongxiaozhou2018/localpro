(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$
            ,form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate
            ,upload = layui.upload
            ,element = layui.element;
        upload.render({
            elem: '#test8'
            ,url: global_path + "/updateUser"
            ,auto: false
            ,accept:'images'
            ,exts:'jpg|png|gif|bmp|jpeg'
            ,bindAction: '#submit_btn'
            ,before: function(obj){
                this.data={
                    'username':$('.username').val(),
                    'role':$('.role').val(),
                    'remarks':$('.remarks').val(),
                    'dept':$('.dept').val(),
                    'telephone':$('.telephone').val(),
                    'id':getQueryString("userID")
                };//关键代码
            } 
            ,choose: function(obj){
                var files = obj.pushFile();
                
                obj.preview(function(index, file, result){
                  $("#imgContent").attr('src',result);
                });
            }
            ,done: function(res, index, upload){
                //假设code=0代表上传成功
                if(res.code == 0){
                    $('#myalert').show();
                    $('#alertConfirm').on('click','a',function(){          //保存成功弹框取消按钮
                        $('#myalert').hide();
                        window.location.href = "./operation.html";
                    });
                }else{
                    alert(res.msg);
                }
                
            }
            ,error: function(index, upload){
                // alert('请求失败');
            }
        });
          //表单初始赋值
        var checkUser = localStorage.getItem('checkUser');
        checkUser = JSON.parse(checkUser).data;
        form.val("example", {
            "username": checkUser.username // "name": "value"
            ,"password": checkUser.password
            ,"role": checkUser.role
            ,"dept": checkUser.dept
            ,"telephone": checkUser.telephone
            ,"remarks": checkUser.remarks
        })
    });
})();

