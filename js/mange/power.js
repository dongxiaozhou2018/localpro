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
        
        var checkUser = sessionStorage.getItem('checkUser');
        if(checkUser){
            var id = JSON.parse(checkUser).data.id;
        }

        getAjax(global_path + "/manage/function/selectOne?id=" + id,function(res){
            
            nodenew = res.children;
            var xtree1 = new layuiXtree({
                elem: 'xtree1'   //(必填) 放置xtree的容器，样式参照 .xtree_contianer
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
            var parms = {
                'id':id,
            }
            if(functionId.length == 0){

                parms.functionId = null;
            }else{
                parms.functionId = functionId;
            }
            var url = global_path + "/manage/function/insertOne";

            commonAjax(url,parms,function(data){
                if(data.code == 0){
                    sessionStorage.removeItem('checkUser');

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
            
        });
            
    });
    
})();

