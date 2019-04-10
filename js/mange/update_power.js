(function(){
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form
            ,layer = layui.layer
            ,layedit = layui.layedit
            ,laydate = layui.laydate;

        $.getJSON(global_path + "/selectFunction", function(data) {
            for(var i = 0;i<data.length;i++){
                var choiceInput = "<input type='checkbox' name='id["+data[i].id+"]' title='"+data[i].functionName+"' checked="+data[i].functionCheck+">";
                $('.choice_power').append(choiceInput);
            }
        })
        var powerUser = sessionStorage.getItem('powerUser');
        powerUser = JSON.parse(powerUser).data;
        form.val("example", {
            "username": powerUser.username // "name": "value"
            ,"remarks": powerUser.remarks
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
                var url = global_path + "/updateFunction";
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){          //添加成功弹框取消按钮
                            sessionStorage.removeItem('powerUser');
                            $('#myalert').hide();
                            window.location.href = "./mange.html?modular=permissionAssignment";
                        });
                    }else{
                        alert(data.msg);
                    }
                })
            }
            

        });
    });
})();

