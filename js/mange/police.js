(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$,
            form = layui.form,
            element = layui.element,
            layer = layui.layer,
            upload = layui.upload,
            layedit = layui.layedit,
            laydate = layui.laydate;
        var HTlogin = sessionStorage.getItem('HTlogin');
        if(HTlogin){
            var at = JSON.parse(HTlogin).data.token;
        }
          //表单初始赋值
        var checkPolice = sessionStorage.getItem('checkPolice');
        if(checkPolice){
            checkPolice = JSON.parse(checkPolice).data[0];
            form.val("example", {
                "alarmType": checkPolice.alarmType
                ,"alarmName": checkPolice.alarmName
                ,"alarmLevel": checkPolice.alarmLevel // "name": "value"
            })
        }
        
        form.on('submit(demo1)', function (data) {
            // var fileId = sessionStorage.getItem('fileId');
            
            var alarmName = $('.alarmName').val();
            var alarmType = $('.alarmType').val();
            var alarmLevel = $('.alarmLevel').val();
            if(alarmName == ''){
                alert('请上传文件');
                return;
            }else if(alarmType == ''){
                alert('请输入报警类型');
                return;
            }else if(alarmLevel == ''){
                alert('请输入报警等级');
                return;
            }else{
                var parms = {
                    'alarmName':data.field.alarmName,
                    'alarmType':data.field.alarmType,
                    'alarmLevel':data.field.alarmLevel,
                }
                if(getQueryString('type') == 'add'){
                    var url = global_path + "/alarmlevel/add_alarmlevel";
                }else if(getQueryString('type') == 'update'){
                    var url = global_path + "/alarmlevel/update_alarmllevel";
                }
                
                commonAjax(url,parms,function(data){
                    if(data.code == 0){
                        $('#myalert').show();
                        $('#alertConfirm').on('click','a',function(){       //保存成功弹框取消按钮
                            sessionStorage.removeItem('fileId');
                            $('#myalert').hide();
                            window.location.href = "./mange.html?modular=police";
                        });
                    }else if(data.code == 401){
                        unauthorized(data.code);
                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
        form.on('submit(demo2)', function (data) {
            sessionStorage.removeItem('fileId');
            window.location.href = "./mange.html?modular=police";
        });
    });
})();

