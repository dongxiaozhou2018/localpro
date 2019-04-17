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
        var checkServer = sessionStorage.getItem('checkServer');
        if(checkServer){
            checkServer = JSON.parse(checkServer).data[0];
            form.val("example", {
                "id": checkServer.id,
                "serverIp": checkServer.serverIp,
                "clientPort": checkServer.clientPort,
                "devPort": checkServer.devPort,
                "devId": checkServer.devId
            })
        }
        
        form.on('submit(demo1)', function (data) {
            // var fileId = sessionStorage.getItem('fileId');
            
            var id = $('.id').val();
            var serverIp = $('.serverIp').val();
            var clientPort = $('.clientPort').val();
            var devPort = $('.devPort').val();
            var devId = $('.devId').val();
            if(id == ''){
                alert('请输入ID');
                return;
            }else if(serverIp == ''){
                alert('请输入服务器IP');
                return;
            }else if(clientPort == ''){
                alert('请输入客户端口');
                return;
            }else if(devPort == ''){
                alert('请输入设备端口');
                return;
            }else if(devId == ''){
                alert('请输入设备ID');
                return;
            }else{
                var parms = {
                    "id": data.field.id,
                    "serverIp": data.field.serverIp,
                    "clientPort": data.field.clientPort,
                    "devPort": data.field.devPort,
                    "devId": data.field.devId
                }
                if(getQueryString('type') == 'add'){
                    var url = global_path + "/accsvr/addService";
                }else if(getQueryString('type') == 'update'){
                    var url = global_path + "/accsvr/updateService";
                    parms.remarks = data.field.remarks;
                }
                
                commonAjax(url,parms,function(data){
                    if(data.code == 0){

                        sessionStorage.removeItem('checkServer');
                        parent.layer.msg(data.msg);
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                        parent.layer.close(index);

                    }else if(data.code == 401){
                        unauthorized(data.code);
                    }else{
                        alert(data.msg);
                    }
                })
            }
        });
    });
})();

