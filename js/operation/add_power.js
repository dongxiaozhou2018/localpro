(function(){
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate;

          //表单初始赋值
        $.getJSON(global_path + "/selectFunction", function(data) {
            for(var i = 0;i<data.length;i++){
                var choiceInput = "<input type='checkbox' name='id["+data[i].id+"]' title='"+data[i].functionName+"'>";
                $('.choice_power').append(choiceInput);
            }
        })
        form.on('submit(demo1)', function (data) {
            var username = $('.username').val();
            var remarks = $('.remarks').val();
            if(username == ''){
                alert('请输入角色名');
                return;
            }else if(remarks == ''){
                alert('请输入用户备注信息');
                return;
            }else{
                var parms = {
                    'username':data.field.username,
                    'remarks':data.field.remarks,
                }
                var url = global_path + "/insertFunction";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){          //添加成功弹框取消按钮
                            $('#myalert').hide();
                            window.location.href = "./operation.html?modular=permissionAssignment";
                        });
                    }else{
                        alert(data.msg);
                    }
                })
            }
            

        });
    });
})();

