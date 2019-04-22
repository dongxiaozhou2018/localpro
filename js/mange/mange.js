$(function () {
    // 删除暂存session数据
    sessionStorage.removeItem('file');
    sessionStorage.removeItem('checkUser');
    var HTlogin = sessionStorage.getItem('HTlogin');
    if(HTlogin){
        var at = JSON.parse(HTlogin).data.token;
    }
    var pageNum = 1,pageSize = 10;
    // 判断渲染模块
    function showModular(){
        var modular = sessionStorage.getItem('modular');
         if(modular == 'userInformation'){              //用户管理-----用户信息
            $('#userInformation').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'yhgl'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            userInformation();
        }else if(modular == 'police' || modular == 'server'){              //服务配置
            $('.btn').each(function(){
                if($(this).attr('name') == 'fwpz'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            if(modular == 'server'){            //接入服务器配置
                $('#server').show().siblings().hide();
                server(pageNum,pageSize);
            }else{                              //报警级别
                $('#police_box').show().siblings().hide();
                police(pageNum,pageSize); 
            }
           
        }else if(modular == 'upgrade'){         //升级维护
            $('#upgradeMaintenance').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'sjwh'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            upgradeMaintenance(pageNum,pageSize);
        }else{
            $('#terminalData').show().siblings().hide();
            echart();
        }
    }
    showModular();
    // 点击事件
    $('.personal').on('click',function(){
        var url = "./personal.html";
        frame('编辑个人信息',url);
    });
    $('.layui-side-scroll').on('click', '.btn', function () { //左侧导航栏
        pageNum = 1; pageSize = 10;
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        if($(this).attr('name') == 'yhgl'){
        	$('#userInformation').show().siblings().hide();
        	userInformation();
        }
        if ($(this).attr('name') == 'zdpz') {
            $('#terminalConfigure').show().siblings().hide();
            terminalConfigure(pageNum,pageSize);
        }
        if ($(this).attr('name') == 'zdzl') {
            $('#terminalData').show().siblings().hide();
            echart();
        }
        if ($(this).attr('name') == 'czrz') {
            $('#oplog').show().siblings().hide();
            oplog();
        }
        // if ($(this).attr('name') == 'fwpz') {
        //     $('#serviceConfiguration').show().siblings().hide();
        //     serviceConfiguration();
        // }
        if ($(this).attr('name') == 'sjwh') {
            $('#upgradeMaintenance').show().siblings().hide();
            upgradeMaintenance(pageNum,pageSize);
        }
    });
    $('.server').on('click', function () { // 接入服务器配置
        $('#server').show().siblings().hide();
        server(pageNum,pageSize);
    });

    $('.police').on('click', function () { // 报警等级设定
        $('#police_box').show().siblings().hide();
        police(pageNum,pageSize);
    });
    $('.logout').on('click', function () { //退出登录
        $('.loginOut').show();
    });
    $('.loginOut').on('click', '.right', function () { //退出登录弹框取消按钮
        $('.loginOut').hide();
    });
    $('.loginOut').on('click', '.left', function () { //退出登录弹框确认按钮
        $('.loginOut').hide();
        getAjax(global_path + "/logout", function (data) {
            if (data.code == 0) {
                sessionStorage.removeItem('HTlogin');
                window.location.href = "../login.html";
            }
        })
    });
    // 修改密码
    $('.changePwd').on('click', function () {
        $('.changePassword').show();
        $('.oldPwd').val(''); //旧密码
        $('.newPwd').val(''); //新密码
        $('.confirmPwd').val('');
    })
    $('.changePassword').on('click', '.right', function () { //修改密码弹框取消按钮
        $('.changePassword').hide();
    });
    $('.changePassword').on('click', '.left', function () { //修改密码弹框确认按钮

        var oldPwd = $('.oldPwd').val(); //旧密码
        var newPwd = $('.newPwd').val(); //新密码
        var confirmPwd = $('.confirmPwd').val(); // 确认新密码
        if (oldPwd == '') {
            alert('请输入您现在的密码');
            return;
        } else if (newPwd == '') {
            alert('请输入用户新密码');
            return;
        } else if (newPwd != confirmPwd) {
            alert('两次输入的密码不一致');
            return;
        } else {
            var parms = {
                'passwordOld': $.md5(oldPwd),
                'passwordNew': $.md5(newPwd),
                'passwordNews': $.md5(confirmPwd)
            }
            var url = global_path + "/changePassword";
            commonAjax(url, parms, function (data) {
                if (data.code == 0) {
                    $('.changePassword').hide();
                    alert(data.msg);
                } else {
                    alert(data.msg);
                }
            })
        }
    });

    // 管理界面渲染
    function user() {
        layui.use('element', function () {
            var element = layui.element;        //导航的hover效果、二级菜单等功能，需要依赖element模块
        });
    }
    user();

    // 编辑信息
    function update(ajaxUrl,id,tit,winUrl,aleSession) {
        var url = global_path + ajaxUrl + "?id="+id;
        getAjax(url, function(data) {
            if (data.code == 0) {
                sessionStorage.setItem('checkUser', JSON.stringify(data));
                var url = winUrl + "?ID=" + id + '&type=update';
                frame(tit,url,aleSession);
            } else if(data.code == 401){
                unauthorized(data.code);
            } else {
                alert(data.msg);
            }
        })
    }
    // 删除信息
    function del(ajaxUrl,id,fnName) {
        var url = global_path + ajaxUrl + "?id="+id;
        getAjax(url, function(data) {
            if(data.code == 0){
                alert(data.msg);
                fnName(pageNum,pageSize);
            }else if(data.code == 401){
                unauthorized(data.code);
            }else{
                alert(data.msg);
            }
        })
        
    }
    // 终端总览
    function echart() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('cake'));
        var aaa = [
            {
                value: 335,
                name: '直接访问'
            },
            {
                value: 310,
                name: '邮件营销'
            },
            {
                value: 234,
                name: '联盟广告'
            },
            {
                value: 135,
                name: '视频广告'
            },
            {
                value: 1548,
                name: '搜索引擎'
            }
		            ];
        option = {
            title: {
                text: '运维箱安全事态（事件类型）',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
                {
                    name: '事件类型',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: aaa,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
		        }
		    ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    echart();

    // 服务配置---------------接入服务器配置
    function server(pageNum,pageSize) {
        layui.use(['table','laypage','laydate','element'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                element = layui.element;

            //执行一个 table 实例
            table.render({
                elem: '#service',
                url: global_path + '/accsvr/getAll', //数据接口
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
                    'pageSize':pageSize
                },
                title: '服务配置',
                page: false, //开启分页
                parseData: function (res) {
                    if(res.code == 0){
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                    }else if(res.code == 401){
                        unauthorized(res.code);
                    }
                },
                cols: [[ //表头
                    {
                        field: 'devId',
                        title: '设备ID',
                        width: '10%',
                        align: 'center'
                    }
                    ,{
                        field: 'serverIp',
                        title: '服务器IP',
                        width: '12.6%',
                        align: 'center'
                    }
                    , {
                        field: 'clientPort',
                        title: '客户端口',
                        width: '12.6%',
                        align: 'center'
                    }
                    , {
                        field: 'devPort',
                        title: '设备端口',
                        width: '12.6%',
                        align: 'center'
                    }
                    , {
                        field: 'url',
                        title: '操作',
                        width: '20.9%',
                        align: 'center',
                        toolbar: '#service_operation'
                    }
                ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'server_laypage'
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

            //监听行工具事件
            table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                // var checkStatus = table.checkStatus(obj.config.id)
                if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        var server_url = global_path + '/accsvr/delServeice';
                        var server_parms = {
                            'id':data.id
                        }
                        commonAjax(server_url,server_parms,function(res){
                            if(res.code == 0){
                                server(pageNum,pageSize);
                            }else if(res.code == 401){
                                unauthorized(res.code)
                            }else{
                                alert(res.msg);
                            }
                        })
                        layer.close(index);
                        //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    var server_url = global_path + '/accsvr/getUpdateOrDelAccsvr';
                    var server_parms = {
                        'id':data.id
                    }
                    commonAjax(server_url,server_parms,function(res){
                        if(res.code == 0){
                            sessionStorage.setItem('checkServer',JSON.stringify(res));
                            var url = "server.html?type=update&id="+data.id;
                            frame('编辑报警类型',url,'server');
                        }else if(res.code == 401){
                            unauthorized(res.code)
                        }else{
                            alert(res.msg);
                        }
                    })
                } else if (layEvent === 'equipment') {
                    var url = "equipment_server.html?serverIp=" + data.serverIp;
                    frame('设备查询',url,'server');
                }
            });

            // 渲染搜索列表
            function searchCity() {
                var devId = $(".devId").val();
                if (devId == "") {
                    $("tr").show();
                    $('#server_laypage').show();
                } else{
                    $("td").each(function () {
                        if ($(this).attr('data-field') == 'devId') {
                            var id = $(this).find('.layui-table-cell').text();
                            if (id.indexOf(devId) != -1) { 
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                    });
                }
            }
            $('.server_query').on('click', function () {
                $('#server_laypage').hide();
                searchCity();
            });
        });
        $('#server_btn').on('click','.layui-btn',function(){
            var url = "server.html?type=add";
            frame('添加服务器',url,'server');
        })
    }
    // 服务配置---------------报警等级设定
    function police(pageNum,pageSize) {
        
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#police',
                url: global_path + '/alarmlevel/select_all_alarmlevel', //数据接口
                method: 'post',
                headers: {
                    'at': at
                },
                contentType : "application/json",
                loading:true,
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize
                },
                title: '报警等级',
                page: false,
                parseData: function (res) {
                    if(res.code == 0){
                        for(var i=0;i<res.data.list.length;i++){
                            if(res.data.list[i].alarmLevel == 1){       //  低
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-normal">低</span>';
                            }else if(res.data.list[i].alarmLevel == 2){        // 中
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-warm">中</span>';
                            }else if(res.data.list[i].alarmLevel == 3){         //高
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-danger">高</span>';
                            }
                        }
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                    }else if(res.code == 401){
                        unauthorized(res.code);
                    }
                    
                },
                cols: [[ //表头
                    {
                        field: 'alarmType',
                        title: '报警类型',
                        width: '20%',
                        align: 'center'
                    }
                    ,{
                        field: 'alarmName',
                        title: '报警名称',
                        width: '33.33%',
                        align: 'center'
                    }
                    
                    , {
                        field: 'alarmLevel',
                        title: '报警等级',
                        width: '23.33%',
                        align: 'center'
                    }
                    , {
                        field: 'url',
                        title: '操作',
                        width: '23.33%',
                        align: 'center',
                        toolbar: '#police_operation'

                    }
                ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'police_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                police(pageNum,pageSize);
                            }
                        }
                    })
                }
            });
            table.on('tool(police)', function (obj) { 
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        var parms = {
                            "alarmName":data.alarmName,
                            'alarmType':data.alarmType
                        }
                        var url = global_path + "/alarmlevel/delete_alarmltype";
                        commonAjax(url,parms, function(res) {
                            alert(res.msg);
                            if(res.code == 0){
                                police(pageNum,pageSize);
                            }else if(res.code == 401){
                                unauthorized(res.code);
                            }
                        })
                        layer.close(index); //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    var police_url = global_path + '/alarmlevel/select_update_alarmllevel';
                    var police_parms = {
                        'alarmType':data.alarmType
                    }
                    commonAjax(police_url,police_parms,function(res){
                        if(res.code == 0){
                            sessionStorage.setItem('checkPolice',JSON.stringify(res));
                            var url = "police.html?type=update";
                            frame('编辑报警类型',url,'police');
                        }
                    })
                }
            });
            //渲染搜索列表
            function searchCity() {
                var police_role = $('.police_role').val();
                if (police_role == '') {
                    $("tr").show();
                    $('#police_laypage').show();
                } else {
                    $("td").each(function () {
                        if ($(this).attr('data-field') == 'alarmLevel') {
                            var alarmLevel = $(this).find('.layui-btn').text();
                            if (alarmLevel.indexOf(police_role) != -1) {
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                    });
                }
            }
            $('.police_query').on('click', function () {
                $('#police_laypage').hide();
                searchCity();
            });
        });
        $('#police_btn').on('click',function(){
            var url = "police.html?type=add";
            frame('添加报警类型',url,'police');
        })
    }

    // 终端配置
    function terminalConfigure(pageNum,pageSize){
        // var url = global_path + '/manage/device/listPage';
        // var parms = {
        //         'pageNum':pageNum,
        //         'pageSize':pageSize
        //     }
        // commonAjax(url,parms,function(res){
        //     if(res.code == 0){
        //         renderTable(res.data.list);
        //     }else if(res.code == 401){
        //         unauthorized(res.code);
        //     }
        // })
        // var renderTable = function (data) {
        //     layui.config({
        //         base: '../js/'
        //     }).extend({
        //         treetable: 'treetable'
        //     }).use(['layer', 'table', 'treetable','laypage','laydate'], function () {
        //         var $ = layui.jquery;
        //         var table = layui.table;
        //         var layer = layui.layer;
        //         var treetable = layui.treetable;
        //         var laydate=layui.laydate,
        //             laypage = layui.laypage;
                
        //         treetable.render({
        //             data:data,
        //             treeColIndex: 2, //树形图标显示在第几列
        //             treeSpid: -1, //最上级的父级id
        //             treeIdName: 'id', //id字段的名称
        //             treePidName: 'pid', //pid字段的名称
        //             treeDefaultClose: true, //是否默认折叠
        //             treeLinkage: false, //父级展开时是否自动展开所有子级
        //             elem: '#terminal', //表格id
        //             page: false, //树形表格一般是没有分页的
        //             cols: [[
        //                 {type: 'radio'},
        //                 {field: 'deviceId', title: '设备ID'},
        //                 {field: 'deviceName', title: '设备名称'},
        //                 {field: 'deviceIP', title: '设备IP'},
        //                 {field: 'devicePort', title: '端口号'},
        //                 {templet: '#terminal_operation', title: '操作'}
        //             ]],
        //             // done: function(res, curr, count){
        //             //     //如果是异步请求数据方式，res即为你接口返回的信息。
        //             //     //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
        //             //     laypage.render({
        //             //         elem:'terminal_laypage'
        //             //         ,count:count
        //             //         ,curr:pageNum
        //             //         ,limit:pageSize
        //             //         ,layout: ['prev', 'page', 'next', 'skip','count']
        //             //         ,jump:function (obj,first) {
        //             //             if(!first){
        //             //                 pageNum = obj.curr;
        //             //                 pageSize = obj.limit;
        //             //                 terminalConfigure(pageNum,pageSize);
        //             //             }
        //             //         }
        //             //     })
        //             // }
        //         });
        //         //监听工具条
        //         table.on('tool(table1)', function (obj) {
        //             var data = obj.data;
        //             var layEvent = obj.event;

        //             if (layEvent === 'del') {
        //                 layer.msg('删除' + data.id);
        //             } else if (layEvent === 'edit') {
        //                 layer.msg('修改' + data.id);
        //             }
        //         });
        //     })
        // }




        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            table.render({
                elem: '#terminal',
                url: global_path + '/manage/device/listPage', //数据接口
                title: '终端配置',
                page: false, //开启分页
                method: 'post',
                headers: {
                    'at': at
                },
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize
                },
                parseData: function (res) {
                    if(res.code == 0){
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                    }else if(res.code == 401){
                        unauthorized(res.code);
                    }
                    
                },
                cols: [[ //表头
                    {
                        field: 'deviceId',
                        title: '设备ID'
                    }
                    , {
                        field: 'deviceName',
                        title: '设备名称'
                    }
                    , {
                        field: 'deviceIP',
                        title: '设备IP'
                    }
                    , {
                        field: 'devicePort',
                        title: '端口号'
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        align: 'center',
                        toolbar: '#terminal_operation'
                    }
                ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'terminal_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                terminalConfigure(pageNum,pageSize);
                            }
                        }
                    })
                }
            });
            table.on('tool(terminal)', function (obj) { 
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'edit') {
                    var terminal_url = global_path + '/device/selectOne?id=' + data.id;
                    getAjax(terminal_url,function(res){
                        if(res.code == 0){
                            sessionStorage.setItem('checkeQuipment',JSON.stringify(res));
                            var url = "equipment.html?type=update";
                            frame('编辑终端设备信息',url,'equipment');
                        }
                    })
                }
            });
        });
        $('#terminal_btn').on('click','.layui-btn',function(){
            var url = "equipment.html?type=add";
            frame('添加终端设备信息',url,'equipment');
        })
    }

    
    // 用户信息
    function userInformation(pageNum,pageSize) {
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#demo',
                url: global_path + '/manage/user/manageUsers', //数据接口
                headers: {
                    'at': at
                },
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize
                },
                title: '用户表',
                page: false, //开启分页
                toolbar: 'default', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                parseData: function (res) {
                    if (res.code == '0') {
                        for (var i = 0; i < res.data.list.length; i++) {
                            if (res.data.list[i].role == 0) {
                                res.data.list[i].role = '管理员';
                            } else if (res.data.list[i].role == 1) {
                                res.data.list[i].role = '操作员';
                            } else if (res.data.list[i].role == 2) {
                                res.data.list[i].role = '维修员';
                            }
                        }
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                    }else if(res.code == 401){
                        unauthorized(res.code);
                    }
                },
                cols: [[ //表头
                    {
                        type: 'checkbox',
                        fixed: 'left'
                    }
			     	, {
                        field: 'id',
                        title: 'ID',
                        width: '5.3%',
                        sort: true,
                        fixed: 'left',
                        align: 'center'
                    }
			     	, {
                        field: 'username',
                        title: '用户名',
                        width: '6.5%',
                        align: 'center'
                    }
                    , {
                        field: 'realName',
                        title: '姓名',
                        width: '8.5%',
                        align: 'center'
                    }
			     	, {
                        field: 'role',
                        title: '类型',
                        width: '8.5%',
                        sort: true,
                        align: 'center'
                    }
			     	, {
                        field: 'dept',
                        title: '部门',
                        width: '6.5%',
                        sort: true,
                        align: 'center'
                    }
			     	, {
                        field: 'telephone',
                        title: '电话',
                        width: '12.5%',
                        align: 'center'
                    }
			     	, {
                        field: 'remarks',
                        title: '备注信息',
                        width: '10.5%',
                        align: 'center'
                    }
			     	, {
                        field: 'url',
                        title: '照片信息',
                        width: '12.5%',
                        align: 'center',
                        toolbar: '#imgUrl'
                    }
			     	, {
                        fixed: 'right',
                        title: '操作',
                        width: '26.5%',
                        align: 'center',
                        toolbar: '#barDemo'
                    }
			    ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'user_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                userInformation(pageNum,pageSize);
                            }
                        }
                    })
                }
            });
            //渲染搜索列表
            function searchCity() {
                var username = $(".username").val().toUpperCase();
                var select_role = $('.select_role').val();
                if (username == "" && select_role == '') {
                    $("tr").show();
                    $('#user_laypage').show();
                } else if(username != "" && select_role == ''){
                    $("td").each(function () {
                        if ($(this).attr('data-field') == 'username') {
                            var name = $(this).find('.layui-table-cell').text().toUpperCase();
                            if (name.indexOf(username) != -1) {
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                    });
                } else if(username == "" && select_role != ''){
                    $("td").each(function () {
                        if ($(this).attr('data-field') == 'role') {
                            var role = $(this).find('.layui-table-cell').text();
                            if (role.indexOf(select_role) != -1) {
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                    });
                }else{
                    var name
                    $("tr").each(function () {
                        $("td").each(function () {
                            if ($(this).attr('data-field') == 'username') {
                                name = $(this).find('.layui-table-cell').text().toUpperCase();
                                if (name.indexOf(username) != -1) {
                                    $(this).parents('tr').show();
                                } else {
                                    $(this).parents('tr').hide();
                                }
                            }
                            if ($(this).attr('data-field') == 'role') {
                                var role = $(this).find('.layui-table-cell').text();
                                if (name.indexOf(username) != -1&&role.indexOf(select_role) != -1) {
                                    $(this).parents('tr').show();
                                } else {
                                    $(this).parents('tr').hide();
                                }
                            }
                        });
                    });
                }
            }
            $('.query').on('click', function () {
                $('#user_laypage').hide();
                searchCity();
            });
            //监听头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id),
                    data = checkStatus.data; //获取选中的数据
                switch (obj.event) {
                    case 'add':
                        var url = "user.html?layEvent=add";
                        frame('添加用户信息',url,'userInformation');
                        break;
                    case 'update':
                        if (data.length === 0) {
                            layer.msg('请选择一行');
                        } else if (data.length > 1) {
                            layer.msg('只能同时编辑一个');
                        } else {
                            update('/manage/user/checkUser',checkStatus.data[0].id,'编辑用户信息','user.html','userInformation');
                        }
                        break;
                    case 'delete':
                        if (data.length === 0) {
                            layer.msg('请选择一行');
                        } else if (data.length > 1) {
                            layer.msg('只能删除一个');
                        } else {
                            del('/manage/user/deleteUser',checkStatus.data[0].id,userInformation);
                        }
                        break;
                };
            });

            //监听行工具事件
            table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        del('/manage/user/deleteUser',data.id,userInformation);
                        layer.close(index); //向服务端发送删除指令
                    });
                } else if (layEvent === 'editUser') {
                    update('/manage/user/checkUser',data.id,'编辑用户信息','user.html','userInformation');
                } else if (layEvent === 'editPower') {
                    update('/manage/user/checkUser',data.id,'编辑用户权限','power.html','userInformation');
                }else if (layEvent === 'pwd') {
                    layer.confirm('真的重置密码吗？', function (index) {
                        resetPwd(data.id);
                        layer.close(index);
                    });
                }
            });

        });
    }
    // 弹出层
    function frame(tit,url,modular){
        layui.use('layer', function(){ //独立版的layer无需执行这一句
            var $ = layui.jquery, layer = layui.layer;
            layer.open({
                type: 2 //此处以iframe举例
                    ,
                title: tit,
                area: ['800px', '600px'],
                shade: 0,
                resize: false,
                content: url,
                yes: function (index,layero) {
                    var body = layer.getChildFrame('body', index);
                    var w = $(layero).find("iframe")[0].contentWindow;
                },

                zIndex: layer.zIndex, //重点1
                success: function (layero) {
                    sessionStorage.setItem('modular',modular);
                    layer.setTop(layero); //重点2
                },
                cancel: function(){ 
                    sessionStorage.removeItem('checkPolice');
                    sessionStorage.removeItem('checkUser');
                    sessionStorage.removeItem('file');
                    sessionStorage.removeItem('checkServer');
                    sessionStorage.removeItem('checkeQuipment');
                }
            });
        })
    }
    // 重置密码
    function resetPwd(id) {
        var url = global_path + "/manage/user/restPassword?id="+id;
        getAjax(url, function(data) {
            if(data.code == 0){
                alert(data.msg);
                userInformation();
            }else if(data.code == 401){
                unauthorized(data.code);
            }
        })
        
    }
    // 操作日志
    function oplog() {
        var startTime = '', endTime = '';
        function showLog(startTime1, endTime1,pageNum,pageSize) {
            layui.use(['table','laypage','laydate'], function () {
                var table = layui.table,
                    laydate=layui.laydate,
                    laypage = layui.laypage;

                table.render({
                    elem: '#test',
                    url: global_path + '/manage/recordinfo/selectRecordInfo', //数据接口
                    method:'post',
                    headers: {
                        'at': at
                    },
                    contentType : "application/json",
                    request: {
                        pageName: 'pageNum', //页码的参数名称，默认：page
                        limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    where: {
                        startTime: startTime1,
                        endTime: endTime1,
                        'pageNum':pageNum,
                        'pageSize':pageSize
                    },
                    title: '操作日志',
                    page: false, //开启分页
                    toolbar: 'default', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                    cellMinWidth: 80,
                    parseData: function (res) {
                        if(res.code == 0&&res.data.list.length>0){
                            for(var i = 0;i<res.data.list.length;i++){
                                var timestamp4 = new Date(res.data.list[i].createTime);
                                res.data.list[i].createTime = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
                            }
                        }
                        if (res.code == 401){
                            unauthorized(res.code);
                        }
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            'data': res.data.list,
                            "count": res.data.total,
                        }
                    },
                    cols: [[ //表头
                        {
                            field: 'information',
                            title: '操作内容',
                            width: '33.33%'
                        }
		      		, {
                            field: 'username',
                            title: '用户名',
                            width: '33.33%'
                        }
		      		, {
                            field: 'createTime',
                            title: '创建时间',
                            width: '33.33%'
                        }
			        ]],
                    done: function(res, curr, count){
                        //如果是异步请求数据方式，res即为你接口返回的信息。
                        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                        laypage.render({
                            elem:'oplog_laypage'
                            ,count:count
                            ,curr:pageNum
                            ,limit:pageSize
                            ,layout: ['prev', 'page', 'next', 'skip','count']
                            ,jump:function (obj,first) {
                                if(!first){
                                    pageNum = obj.curr;
                                    pageSize = obj.limit;
                                    showLog(startTime, endTime,pageNum,pageSize);
                                }
                            }
                        })
                    }
                });
            });
        }
        showLog('', '',pageNum,pageSize);
        //日期时间选择器
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#startTime',
                type: 'datetime'
            });
            laydate.render({
                elem: '#endTime',
                type: 'datetime'
            });
        });
        $('.query').on('click', function () {
            startTime = $('#startTime').val();
            endTime = $('#endTime').val();
            startTime = Date.parse(startTime);
            endTime = Date.parse(endTime);
            showLog(startTime, endTime,pageNum,pageSize);
        })
    }
    // 升级维护
    function upgradeMaintenance(pageNum,pageSize) {
        layui.use(['table','upload','laypage','laydate'], function () {
            var upload = layui.upload,
                table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#upgrade',
                url: global_path + '/manage/version/selectVersionInfo', //数据接口
                headers: {
                    'at': at
                },
                title: '升级维护',
                page: false //开启分页
                    ,
                request: {
                    pageName: 'pageNum', //页码的参数名称，默认：page
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where: {
                    'pageNum':pageNum,
                    'pageSize':pageSize
                },
                parseData: function (res) {
                    if(res.code == 0){
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            'data': res.data.list,
                            "count": res.data.total,
                        }
                    }else if (res.code == 401){
                        unauthorized(res.code);
                    }
                    
                },
                cols: [[ //表头
                    {
                        field: 'id',
                        title: 'ID',
                        width: '10%',
                        align: 'center'
                    },
                    {
                        field: 'version',
                        title: '版本名称',
                        width: '10%',
                        align: 'center'
                    }
			      	, {
                        field: 'createTime',
                        title: '上传时间',
                        width: '20%',
                        align: 'center'
                    }
			      	, {
                        field: 'versionInfo',
                        title: '版本说明',
                        width: '44.5%',
                        align: 'center'
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        width: '15.5%',
                        align: 'center',
                        toolbar: '#upgrade_operation'
                    }
			    ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'upgrade_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                upgradeMaintenance(pageNum,pageSize);
                            }
                        }
                    })
                }
            });

            function request(id) {
                var url = global_path + '/manage/user/downLoad?id='+id+'&at='+at;
                window.open(url);
            }
            //监听行工具事件
            table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'download') {
                    request(data.id);
                }
            });
        });
        $('#equipment_btn').on('click','.layui-btn',function(){
            var url = "add_equipment.html";
            frame('添加升级设备信息',url,'upgrade');
        })
    }
})