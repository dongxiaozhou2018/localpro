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
        
        var id = getQueryString('deviceId');
        commonAjax(global_path + "/manage/user/getOperRealName",{'id':id},function(res){
            
            nodenew = res.data.list;
            var xtree1 = new layuiXtree({
                elem: 'xtree'   //(必填) 放置xtree的容器，样式参照 .xtree_contianer
                , form: form     //(必填) layui 的 from
                , data: nodenew     //(必填) json数据
            });
        })

        form.on('submit(demo1)', function (data) {
            var functionId = [];
            $('input').each(function(){
                if($(this).is(':checked')){
                    functionId.push($(this).attr('value'));
                }
            })
            var remarks = $('.remarks').val();
            if(functionId.length == 0){
                alert('请选择要分派的人员');
            }else if(remarks == ''){
                alert('请填写派工备注');
            }else{
                var parms = {
                    'id':id,
                    'functionId':functionId,
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

