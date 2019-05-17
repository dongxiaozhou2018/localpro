(function(){
    var pageNum = 1,pageSize = 10;
    function server(pageNum,pageSize) {
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#equipment',
                url: global_path + '/manage/accsvr/selectDevIdListByServerIp', //数据接口
                method: 'post',
                headers: {
                    'at': at
                },
                id: 'serviceBox',
                contentType : "application/json",
                loading:true,
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize,
                    'serverIp':getQueryString("serverIp")
                },
                title: '设备查询',
                page: false, //开启分页
                parseData: function (res) {
                    if(res.code == 0){
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                    }else if(res.code == -1){
                        unauthorized(res.code);
                    }else{
                        alert(res.msg);
                    }
                },
                cols: [[ //表头
                    {
                        field: 'deviceId',
                        title: '设备ID',
                        width: '20%',
                        align: 'center'
                    }
                    ,{
                        field: 'deviceName',
                        title: '设备名称',
                        width: '22.6%',
                        align: 'center'
                    }
                    , {
                        field: 'deviceIP',
                        title: '设备IP',
                        width: '22.6%',
                        align: 'center'
                    }
                    , {
                        field: 'devicePort',
                        title: '设备端口',
                        width: '15.6%',
                        align: 'center'
                    }
                ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'equipment_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                server(pageNum,pageSize);
                            }
                        }
                    })
                }
            });
        });
    }
    server(pageNum,pageSize);
})();

