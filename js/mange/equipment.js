(function(){
    layui.use(['form', 'layedit', 'laydate',"jquery", "upload", "layer", "element"], function(){
        var $ = layui.$,
            form = layui.form,
            element = layui.element,
            layer = layui.layer,
            upload = layui.upload,
            layedit = layui.layedit,
            laydate = layui.laydate;
          //表单初始赋值
        var url = global_path + '/manage/model/queryAllModel';
        getAjax(url, function(res) {
            if (res.code == 0) {
                if(res.data.length>0){
                    for(var i = 0;i<res.data.length;i++){
                        var mode = '<option value="'+res.data[i].id+'">'+res.data[i].modelName+'</option>';
                        $('.modelId').append(mode);
                    }
                }
                form.render();
                var checkeQuipment = sessionStorage.getItem('checkUser');
                if(checkeQuipment){
                    checkeQuipment = JSON.parse(checkeQuipment).data;
                    form.val("example", {
                        "deviceName": checkeQuipment.deviceName,
                        "deviceId": checkeQuipment.deviceId,
                        "deviceIP": checkeQuipment.deviceIP,
                        "devicePort": checkeQuipment.devicePort,
                        "modelId": checkeQuipment.modelId
                    })
                }
            } else if(res.code == -1){
                unauthorized(res.code);
            } else {
                alert(res.msg);
            }
        })
        
        
        form.on('submit(demo1)', function (data) {
            var deviceName = $('.deviceName').val();
            var deviceId = $('.deviceId').val();
            var deviceIP = $('.deviceIP').val();
            var devicePort = $('.devicePort').val();
            var modelId = $('.modelId').val();
            if(deviceName == ''){
                alert('请输入服务器IP');
                return;
            }else if(deviceId == ''){
                alert('请输入客户端口');
                return;
            }else if(deviceIP == ''){
                alert('请输入设备端口');
                return;
            }else if(devicePort == ''){
                alert('请输入设备ID');
                return;
            }else if(modelId == ''){
                alert('请输入设备ID');
                return;
            }else{
                var parms = {
                    "deviceName":deviceName,
                    "deviceId":deviceId,
                    "deviceIP":deviceIP,
                    "devicePort":devicePort,
                    "modelId":modelId
                }
                if(getQueryString('type') == 'add'){
                    var url = global_path + "/manage/device/addDevice";
                }else if(getQueryString('type') == 'update'){
                    var url = global_path + "/manage/device/updateDevice";
                    parms.id = getQueryString('ID');
                }
                
                commonAjax(url,parms,function(data){
                    if(data.code == 0){

                        sessionStorage.removeItem('checkeQuipment');
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

