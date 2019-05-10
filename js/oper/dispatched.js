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

        getAjax(global_path + "/manage/user/findFixer",function(res){
            if (res.code == 0) {
                var firstmodel = '<option value="">请选择指派人员</option>';
                $('.repairRname').append(firstmodel);
                if(res.data.length>0){
                    for(var i = 0;i<res.data.length;i++){
                        var mode = '<option value="'+res.data[i].id+'">'+res.data[i].realName+'</option>';
                        $('.repairRname').append(mode);
                    }
                    form.render();
                }

            } else if(res.code == -1){
                unauthorized(res.code);
            } else {
                alert(res.msg);
            }
        })

        form.on('submit(demo1)', function (data) {
            var id = getQueryString('deviceId');
            var repairRname = $('.repairRname').val();
            var remarks = $('.remarks').val();
            if(repairRname == ''){
                alert('请选择维修员');
            }else if(remarks == ''){
                alert('请填写派工备注');
            }else{
                var parms = {
                    'id':id,
                    'repairManId':repairRname,
                    'remarks':remarks
                }
                var url = global_path + "/oper/alarmRecord/dealAlarm";

                commonAjax(url,parms,function(data){
                    if(data.code == 0){

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

