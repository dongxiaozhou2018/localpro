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
            // ,bindAction: '#test8'
            ,choose: function(obj){
                var files = obj.pushFile();
                obj.preview(function(index, file, result){
                  $("#imgContent").attr('src',result);
                });
            }
        });
      //监听提交
      form.on('submit(demo1)', function(data){
        console.log(data.field);
        var parms = {
            'username':data.field.username,
            'password':data.field.password,
            'role':data.field.role,
            'remarks':data.field.remarks,
            'dept':data.field.dept,
            'telephone':data.field.telephone,
            'file':data.field.file
        }
        var url = global_path + "/addUser";
        commonAjax(url,parms,function(data){
            if(data.code == 0){
                $('#myalert').show();
            }else{
                alert(data.msg);
            }
        },function(){
            alert('请求失败');
        })
        
      });
      
    });
    

})();
