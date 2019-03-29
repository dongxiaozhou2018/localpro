(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$,
            form = layui.form,
            element = layui.element,
            layer = layui.layer,
            upload = layui.upload,
            layedit = layui.layedit,
            laydate = layui.laydate;
      
         upload.render({
            elem: '#test8'
            ,url: global_path + "/addUser"
            ,auto: false
            ,accept:'images'
            ,exts:'jpg|png|gif|bmp|jpeg'
            ,bindAction: '#submit_btn'
            ,before: function(obj){
                this.data={
                    'username':$('.username').val(),
                    'password':$('.password').val(),
                    'role':$('.role').val(),
                    'remarks':$('.remarks').val(),
                    'dept':$('.dept').val(),
                    'telephone':$('.telephone').val()
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
                    $('#alertConfirm').on('click','a',function(){          //退出登录弹框取消按钮
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
      
    });
})();

