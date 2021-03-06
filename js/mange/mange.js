$(function () {

    // 选择时间默认一天
    var nowTime = new Date().getTime();
    nowTime = new Date(nowTime);
    var startTime2 = nowTime.toLocaleDateString().replace(/\//g, "-") + ' ' + '00:00:00';
    var endTime2 = nowTime.toLocaleDateString().replace(/\//g, "-") + ' ' + '23:59:59';
    
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
        pageNum = 1; pageSize = 10;
        var modular = sessionStorage.getItem('modular');
        $('.layui-body').css('bottom','44px');
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
           
        }else if(modular == 'equipment'){         //终端设备
            $('#terminalConfigure').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'zdpz'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            terminalConfigure();
        }else if(modular == 'upgrade'){         //升级维护
            $('#upgradeMaintenance').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'sjwh'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            upgradeMaintenance(pageNum,pageSize);
        }else if(modular == 'groupManage'){         //分组管理
            $('#groupManage').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'fzgl'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            upgradeMaintenance(pageNum,pageSize);
        }else{
            $('#terminalConfigure').show().siblings().hide();
            terminalConfigure();
        }
    }
    showModular();
    // 点击事件
    $('.personal').on('click',function(){
        var url = "../personal.html";
        frame('编辑个人信息',url);
    });
    $('.layui-side-scroll').on('click', '.btn', function () { //左侧导航栏
        pageNum = 1; pageSize = 10;
        sessionStorage.removeItem('modular');
        $('.layui-body').css('bottom','44px');
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        if($(this).attr('name') == 'yhgl'){
        	$('#userInformation').show().siblings().hide();
        	userInformation();
        }
        if ($(this).attr('name') == 'dtpz') {
            $('.map_box').show().siblings().hide();
            map();
        }
        if ($(this).attr('name') == 'zdpz'||$(this).attr('name') == 'sbqy') {
            $('#terminalConfigure').show().siblings().hide();
            if($(this).attr('name') == 'sbqy'){
                terminalConfigure('sbqy');
                $('.terminal_search').hide();
            }else{
                terminalConfigure();
                $('.terminal_search').show();
            }
            
        }
        // if ($(this).attr('name') == 'zdzl') {
        //     $('#terminalData').show().siblings().hide();
        //     echart();
        // }
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
        if($(this).attr('name') == 'fzgl'){
            $('#groupManage').show().siblings().hide();
            groupManage(pageNum,pageSize);
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
                window.location.href = "../../login.html";
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
                } else if(data.code == -1){
                    unauthorized(data.code)
                } else {
                    alert(data.msg);
                }
            })
        }
    });

     // 地图查询、分组树显示
    $('.map_box').on('click','.show_list',function(){
        
        if($('.show_list').find('i').hasClass('layui-icon-next')){
            $('#map_tree').show();
            $('.show_list').css('left','18%');
            $('.Identification').css('left','19%');
            $('.show_list').html('<i class="layui-icon layui-icon-search layui-icon-prev"></i> 设备地址');
            // $('.show_list').find('i').removeClass('layui-icon-next').addClass('');
        }else{
            $('#map_tree').hide();
            $('.show_list').css('left','0');
            $('.Identification').css('left','10px');
            $('.show_list').html('设备地址 <i class="layui-icon layui-icon-search layui-icon-next"></i>');
            // $('.show_list').find('i').removeClass('layui-icon-prev').addClass('layui-icon-next');
        }
        
    })
    // 地图刷新
    $('.Identification3').on('click','img',function(){
        map();
    })
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
            } else if(data.code == -1){
                unauthorized(data.code);
            } else {
                alert(data.msg);
            }
        })
    }
    // 删除信息
    function del(ajaxUrl,id,fnName) {
        
        var url = global_path + ajaxUrl + '?id=' + id;
        getAjax(url,function(data) {
            if(data.code == 0){
                alert(data.msg);
                fnName(pageNum,pageSize);
            }else if(data.code == -1){
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
    // echart();

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
                url: global_path + '/manage/accsvr/getAll', //数据接口
                method:'post',
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
                    }else if(res.code == -1){
                        unauthorized(res.code);
                    }else{
                        alert(res.msg);
                    }
                },
                cols: [[ //表头
                    {
                        field: 'id',
                        title: 'ID',
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
                        field: 'remarks',
                        title: '备注',
                        width: '10%',
                        align: 'center',
                    }
                    , {
                        field: 'count',
                        title: '数量',
                        width: '10%',
                        align: 'center',
                    }
                    , {
                        field: 'state',
                        title: '状态',
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
                        var server_url = global_path + '/manage/accsvr/delAccsvrById?id=' + data.id;
                        getAjax(server_url,function(res){
                            if(res.code == 0){
                                server(pageNum,pageSize);
                            }else if(res.code == -1){
                                unauthorized(res.code)
                            }else{
                                alert(res.msg);
                            }
                        })
                        layer.close(index);
                        //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    var server_url = global_path + '/manage/accsvr/getUpdateOrDelAccsvr';
                    var server_parms = {
                        'id':data.id
                    }
                    commonAjax(server_url,server_parms,function(res){
                        if(res.code == 0){
                            sessionStorage.setItem('checkServer',JSON.stringify(res));
                            var url = "server.html?type=update&id="+data.id;
                            frame('编辑报警类型',url,'server');
                        }else if(res.code == -1){
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
                url: global_path + '/manage/alarmlevel/select_all_alarmlevel', //数据接口
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
                    }else if(res.code == -1){
                        unauthorized(res.code);
                    }else{
                        alert(res.msg);
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
                },
                id: 'testReload'
            });
            var $ = layui.$, active = {
                reload: function(){
                    var police_role = $('.police_role');
                  
                  //执行重载
                    table.reload('testReload', {
                        url: global_path + '/manage/alarmlevel/getAllByAlarmLevel',
                        where: {
                            'alarmLevel': police_role.val(),
                        }
                    });
                }
            };
              
            $('.police_query').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.police_role').val('');
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
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
                        var url = global_path + "/manage/alarmlevel/delete_alarmltype";
                        commonAjax(url,parms, function(res) {
                            alert(res.msg);
                            if(res.code == 0){
                                police(pageNum,pageSize);
                            }else if(res.code == -1){
                                unauthorized(res.code);
                            }else{
                                alert(res.msg);
                            }
                        })
                        layer.close(index); //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    var police_url = global_path + '/manage/alarmlevel/select_update_alarmllevel';
                    var police_parms = {
                        'alarmType':data.alarmType
                    }
                    commonAjax(police_url,police_parms,function(res){
                        if(res.code == 0){
                            sessionStorage.setItem('checkPolice',JSON.stringify(res));
                            var url = "police.html?type=update";
                            frame('编辑报警类型',url,'police');
                        }else if(res.code == -1){
                            unauthorized(res.code);
                        }else{
                            alert(res.msg);
                        }
                    })
                }
            });
        });
        $('#police_btn').on('click',function(){
            var url = "police.html?type=add";
            frame('添加报警类型',url,'police');
        })
    }


    // 地图配置
    function map() {

        var map = new L.Map("mapid", {
            zoom: 9,
            center: [39.0850853357,117.1993482089],
            boxZoom: true, 
        });
        var url = "http://webrd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
        var layer1 = new L.TileLayer(url, {
            subdomains:"1234"
        });
        map.addLayer(layer1);
        var result = [{
            title: "名称：天津市西青区",
            lat:39.139446,
            lng:117.012247,
            address: "天津市西青区",
            tel: "12306"
        },
        {
            title: "名称：天津市河东区",
            lat:39.122125,
            lng:117.226568,
            address: "天津市河东区 ",
            tel: "18500000000"
        },
        {
            title: "名称：天津市东丽区",
            lat:39.087764,
            lng:117.313967,
            address: "天津市东丽区",
            tel: "18500000000"
        },
        {
            title: "名称：天津市滨海新区",
            lat:39.032846,
            lng:117.654173,
            address: "天津市滨海新区",
            tel: "18500000000"
        }];
        var layers=[];
        for(var i = 0;i< result.length;i++){
            var layer = new L.marker([ result[i].lat, result[i].lng ]);
            layers.push(layer);
            layer.bindPopup(result[i].address);
        }
        var myGroup=L.layerGroup(layers);
        map.addLayer(myGroup);

        $('.layui-body').css('bottom','0');

        // 绑定事件,点击编辑可拖拽点
        $('.Identification').on('click','.layui-icon-edit',function(){
            
            for(x in myGroup._layers){
                myGroup._layers[x].dragging.enable();
            }
        })
        
        // 绑定事件,点击保存不可拖拽点
        $('.Identification').on('click','.layui-icon-ok',function(){
            var LatLng_Arr = [];
            for(x in myGroup._layers){
                myGroup._layers[x].dragging.disable();
                
                var LatLng_Str = myGroup._layers[x].getLatLng().lat + ',' + myGroup._layers[x].getLatLng().lng;

                LatLng_Arr.push(LatLng_Str);
            }
        })

        // 绑定事件,点击添加可拖拽点
        $('.Identification').on('click','.layui-icon-add-1',function(){
            var marker3 = new L.marker([39.003313,117.218349], { draggable: true });
            layers.push(marker3);
            myGroup=L.layerGroup(layers);
            map.addLayer(myGroup);

        })
        
        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;
            // 分组树
            $('#map_demo').html('');
            var newTree = [];
            getAjax(global_path + "/manage/group/groupTree",function(res){
                if(res.code == 0){
                    newTree.push(res.data);
                    layui.tree({
                        elem: '#map_demo' //指定元素
                        ,click: function(item){ //点击最里层节点回调
                            if(item.point&&item.point!=''){
                                //第1步：设置地图中心点
                                var point = new BMap.Point(item.point);
                                //第2步：初始化地图,设置中心点坐标和地图级别。  
                                map.centerAndZoom(point, 12);
                            }
                        }
                        ,nodes: menutree(newTree)
                    });
                } else if(res.code == -1){
                    unauthorized(res.code);
                } else {
                    alert(res.msg);
                }
            })
        })

    }

    // 终端配置、设备区域
    function terminalConfigure(name){


        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;

            // 设备型号
            $('.modelId').html('');
            var url = global_path + '/manage/model/queryAllModel';
            getAjax(url, function(res) {
                if (res.code == 0) {
                    var firstmodel = '<option value="">请选择</option>';
                    $('.modelId').append(firstmodel);
                    if(res.data.length>0){
                        for(var i = 0;i<res.data.length;i++){
                            var mode = '<option value="'+res.data[i].id+'">'+res.data[i].modelName+'</option>';
                            $('.modelId').append(mode);
                        }
                    }

                } else if(res.code == -1){
                    unauthorized(res.code);
                } else {
                    alert(res.msg);
                }
            })

            // 分组树
            function groupTree(){
                $('#terminal_demo').html('');
                var newTree = [];
                getAjax(global_path + "/manage/group/groupTree",function(res){
                    if(res.code == 0){
                        newTree.push(res.data);
                        layui.tree({
                            elem: '#terminal_demo' //指定元素
                            ,click: function(item){ //点击最里层节点回调
                                if(item.children.length == 0){
                                    if(name == 'sbqy'){
                                        equipmentArea('','',pageNum,pageSize);
                                    }else{
                                        terminalTab(global_path + '/manage/device/listPage',item.id,pageNum,pageSize);
                                    }
                                }
                            }
                            ,nodes: menutree(newTree)
                        });
                    }
                })
            }
            groupTree();
            if(name == 'sbqy'){
                equipmentArea('','',pageNum,pageSize);
            }else{
                terminalTab('','',pageNum,pageSize);
            }
            function equipmentArea(url,id,pageNum,pageSize){
                if(!url){
                    url = global_path + '/manage/device/findAllPage';
                }
                table.render({
                    elem: '#terminal',
                    url: url, //数据接口
                    title: '终端配置',
                    page: false, //开启分页
                    method: 'post',
                    headers: {
                        'at': at
                    },
                    contentType : "application/json",
                    request: {
                        pageName: 'pageNum' //页码的参数名称，默认：page
                        ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    where:{
                        'pageNum':pageNum,
                        'pageSize':pageSize,
                        'id':id
                    },
                    parseData: function (res) {
                        if(res.code == 0){
                            for (var i = 0; i < res.data.list.length; i++) {
                                if (res.data.list[i].status == 0) {
                                    res.data.list[i].status = '<button class="layui-btn layui-btn-warm layui-btn-xs">不在线</button>';
                                } else if (res.data.list[i].status == 1) {
                                    res.data.list[i].status = '<button class="layui-btn layui-btn-normal layui-btn-xs">在线</button>';
                                }
                            }
                            return {
                                'code': res.code,
                                'msg': res.msg,
                                "count": res.data.total,
                                'data': res.data.list
                            }
                        }
                        
                    },
                    cols: [[ //表头
                        {
                            field: 'deviceId',
                            title: '设备ID'
                        }
                        , {
                            field: 'deviceName',
                            title: '设备地址'
                        }
                        , {
                            fixed: 'right',
                            title: '操作',
                            align: 'center',
                            toolbar: '#equipmentArea'
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
                                    terminalTab('','',pageNum,pageSize);
                                }
                            }
                        })
                    },
                    id: 'testReload'
                });

            }

            function terminalTab(url,id,pageNum,pageSize){
                if(!url){
                    url = global_path + '/manage/device/findAllPage';
                }
                table.render({
                    elem: '#terminal',
                    url: url, //数据接口
                    title: '终端配置',
                    page: false, //开启分页
                    method: 'post',
                    headers: {
                        'at': at
                    },
                    contentType : "application/json",
                    request: {
                        pageName: 'pageNum' //页码的参数名称，默认：page
                        ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    where:{
                        'pageNum':pageNum,
                        'pageSize':pageSize,
                        'id':id
                    },
                    parseData: function (res) {
                        if(res.code == 0){
                            for (var i = 0; i < res.data.list.length; i++) {
                                if (res.data.list[i].status == 0) {
                                    res.data.list[i].status = '<button class="layui-btn layui-btn-warm layui-btn-xs">不在线</button>';
                                } else if (res.data.list[i].status == 1) {
                                    res.data.list[i].status = '<button class="layui-btn layui-btn-normal layui-btn-xs">在线</button>';
                                }
                            }
                            return {
                                'code': res.code,
                                'msg': res.msg,
                                "count": res.data.total,
                                'data': res.data.list
                            }
                        }
                        
                    },
                    cols: [[ //表头
                        {
                            field: 'deviceId',
                            title: '设备ID',
                            width: '16.6%'
                        }
                        , {
                            field: 'deviceName',
                            title: '设备名称',
                            width: '10.6%'
                        }
                        , {
                            field: 'deviceIP',
                            title: '设备IP',
                            width: '10.6%'
                        }
                        , {
                            field: 'devicePort',
                            title: '端口号',
                            width: '10.6%'
                        }
                        , {
                            field: 'modelName',
                            title: '设备型号',
                            width: '16.6%'
                        }
                        , {
                            field: 'status',
                            title: '状态',
                            width: '10%',
                            align: 'center',
                        }
                        , {
                            fixed: 'right',
                            title: '操作',
                            width: '22.6%',
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
                                    terminalTab('','',pageNum,pageSize);
                                }
                            }
                        })
                    },
                    id: 'testReload1'
                });

            }
            var $ = layui.$, active = {
                reload: function(){
                    var deviceId = $('.deviceId').val();
                    var deviceName = $('.deviceName').val();
                    var deviceIP = $('.deviceIP').val();
                    var modelId = $('.modelId').val();
                    //执行重载
                    table.reload('testReload1', {
                        url: global_path + '/manage/device/listPage',
                        where: {
                            'deviceId': deviceId,
                            'deviceName': deviceName,
                            'deviceIP': deviceIP,
                            'modelId':modelId,
                            'id':''
                        }
                    });
                }
            };
              
            $('.terminal').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.deviceId').val('');
                $('.deviceName').val('');
                $('.deviceIP').val('');
                $('.modelId').val('');
                deviceId = '';
                deviceName = '';
                deviceIP = '';
                modelId = '';
                terminalTab('','',pageNum,pageSize);
            });
            table.on('tool(terminal)', function (obj) {
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'edit') {
                    update('/manage/device/selectOne',data.id,'编辑终端设备信息','equipment.html','equipment');
                }else if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        var url = global_path + "/manage/device/deleteDevice?id="+data.id;
                        getAjax(url, function(data) {
                            if(data.code == 0){
                                alert(data.msg);
                                terminalTab('','',pageNum,pageSize);
                            }else if(data.code == -1){
                                unauthorized(data.code);
                            }else{
                                alert(data.msg);
                            }
                        })
                        layer.close(index); //向服务端发送删除指令
                    });
                }else if(layEvent === 'control'){
                    var maxWidth = $('.layui-body').width();
                    var maxHeight = $('.layui-body').height();
                    layui.use('layer', function(){ //独立版的layer无需执行这一句
                    var $ = layui.jquery, layer = layui.layer;
                    layer.open({
                        type: 2 //此处以iframe举例
                            ,
                        title: '数据监控展示',
                        area: ['1120px', '800px'],
                        shade: 0,
                        resize: true,
                        tipsMore: false,
                        maxmin:true,
                        scrollbar:true,
                        content: '../../aa/devset.jsp.html',
                        zIndex: layer.zIndex, //重点1
                        success: function (layero) {
                            sessionStorage.setItem('modular','equipment');
                            layer.setTop(layero); //重点2
                        },
                        cancel: function(){ 
                            layer.closeAll();
                        }
                    });
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
        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;

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
                    }else if(res.code == -1){
                        unauthorized(res.code);
                    } else {
                        alert(res.msg);
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
                },
                id:'testReload'
            });
            var $ = layui.$, active = {
                reload: function(){
                    var realName = $('.realName');
                    var select_role = $('.select_role');
                    var telephone = $('.telephone');
                  
                    //执行重载
                    table.reload('testReload', {
                        where: {
                            'realName': realName.val(),
                            'role': select_role.val(),
                            'telephone': telephone.val(),
                        }
                    });
                }
            };
              
            $('.query').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.user_empty').on('click', function(){
                $('.realName').val('');
                $('.select_role').val('');
                $('.telephone').val('');
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            //监听头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id),
                    data = checkStatus.data; //获取选中的数据
                switch (obj.event) {
                    case 'add':
                        var url = "user.html?type=add";
                        frame('添加用户信息',url,'userInformation');
                        break;
                    case 'update':
                        if (data.length === 0) {
                            layer.msg('请勾选要操作的记录');
                        } else if (data.length > 1) {
                            layer.msg('只能同时编辑一个');
                        } else {
                            update('/manage/user/checkUser',data[0].id,'编辑用户信息','user.html','userInformation');
                        }
                        break;
                    case 'delete':
                        if (data.length === 0) {
                            layer.msg('请勾选要操作的记录');
                        } else if (data.length > 1) {
                            layer.confirm('真的删除行么', function (index) {
                                var userId = [];
                                for(var i = 0;i<data.length;i++){
                                    userId.push(data[i].id);
                                }
                                var parms = {
                                    'userIds':userId
                                }

                                commonAjax(global_path + "/manage/user/delByChoose",parms,function(res){
                                    if(res.code == 0){
                                        alert(data.msg);
                                        userInformation(pageNum,pageSize);
                                    }else if(res.code == -1){
                                        unauthorized(res.code);
                                    }else{
                                        alert(res.msg);
                                    }
                                })
                                
                                layer.close(index);
                            });
                            
                        } else {
                            layer.confirm('真的删除行么', function (index) {
                                del('/manage/user/deleteUser',data[0].id,userInformation);
                                layer.close(index);
                            });
                            
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
                type: 2, //此处以iframe举例
                id:'111',
                title: tit,
                area: ['800px', '600px'],
                shade: 0,
                resize: false,
                tipsMore: false,
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
                    layer.closeAll();
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
            }else if(data.code == -1){
                unauthorized(data.code);
            } else {
                alert(data.msg);
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
                    cellMinWidth: 80,
                    parseData: function (res) {
                        if(res.code == 0){
                            for(var i = 0;i<res.data.list.length;i++){
                                var timestamp4 = new Date(res.data.list[i].createTime);
                                res.data.list[i].createTime = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
                            }
                        }else if (res.code == -1){
                            unauthorized(res.code);
                        } else {
                            alert(res.msg);
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
                type: 'datetime',
                value: startTime2
            });
            laydate.render({
                elem: '#endTime',
                type: 'datetime',
                value: endTime2
            });
        });
        $('.query').on('click', function () {
            startTime = $('#startTime').val();
            endTime = $('#endTime').val();
            startTime = Date.parse(startTime);
            endTime = Date.parse(endTime);
            showLog(startTime, endTime,pageNum,pageSize);
        })
        $('.empty').on('click', function () {
            $('#startTime').val('');
            $('#endTime').val('');
            startTime = '';
            endTime = '';
            showLog('', '',pageNum,pageSize);
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
                    }else if (res.code == -1){
                        unauthorized(res.code);
                    }else{
                        alert(res.msg);
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


    // 分组管理
    function groupManage(){


        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;


            // 分组树
            $('#group_demo').html('');
            var newTree = [];
            getAjax(global_path + "/manage/group/groupTree",function(res){
                if(res.code == 0){
                    newTree.push(res.data);
                    layui.tree({
                        elem: '#group_demo' //指定元素
                        ,click: function(item){ //点击最里层节点回调
                            // if(item.children.length == 0){
                            terminalTab(global_path + '/manage/group/selectSubGroup',item.id,pageNum,pageSize);
                            // }
                        }
                        ,nodes: menutree(newTree)
                    });
                }
            })
            terminalTab('','',pageNum,pageSize);

            function terminalTab(url,id,pageNum,pageSize){
                if(!url){
                    url = global_path + '/manage/group/listPage';
                }
                table.render({
                    elem: '#group',
                    url: url, //数据接口
                    title: '终端配置',
                    page: false, //开启分页
                    method: 'post',
                    headers: {
                        'at': at
                    },
                    contentType : "application/json",
                    request: {
                        pageName: 'pageNum' //页码的参数名称，默认：page
                        ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                    },
                    where:{
                        'pageNum':pageNum,
                        'pageSize':pageSize,
                        'id':id
                    },
                    parseData: function (res) {
                        if(res.code == 0){
                            return {
                                'code': res.code,
                                'msg': res.msg,
                                "count": res.data.total,
                                'data': res.data.list
                            }
                        }

                    },
                    cols: [[ //表头
                        {
                            field: 'id',
                            title: '编号',
                            align: 'center',
                            width: '20%'
                        }
                        , {
                            field: 'groupName',
                            title: '组别名称',
                            align: 'center',
                            width: '40%'
                        }
                        , {
                            fixed: 'right',
                            title: '操作',
                            width: '30%',
                            align: 'center',
                            toolbar: '#group_operation'
                        }
                    ]],
                    done: function(res, curr, count){
                        //如果是异步请求数据方式，res即为你接口返回的信息。
                        //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                        laypage.render({
                            elem:'group_laypage'
                            ,count:count
                            ,curr:pageNum
                            ,limit:pageSize
                            ,layout: ['prev', 'page', 'next', 'skip','count']
                            ,jump:function (obj,first) {
                                if(!first){
                                    pageNum = obj.curr;
                                    pageSize = obj.limit;
                                    terminalTab('','',pageNum,pageSize);
                                }
                            }
                        })
                    },
                    id: 'testReload'
                });

            }
            var $ = layui.$, active = {
                reload: function(){
                    var id = $('.id').val();
                    var groupName = $('.groupName').val();
                    var parentId = $('.parentId').val();
                    //执行重载
                    table.reload('testReload', {
                        url: global_path + '/manage/group/listPage',
                        where: {
                            'groupName': groupName,
                            'parentId': parentId,
                            'id':''
                        }
                    });
                }
            };

            $('.group').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.id').val('');
                $('.groupName').val('');
                $('.parentId').val('');
                id = '';
                groupName = '';
                parentId = '';
                terminalTab('','',pageNum,pageSize);
            });
            table.on('tool(group)', function (obj) {
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'edit') {
                    update('/manage/group/selectOne',data.id,'添加分组','add_group.html','group');
                }else if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        var url = global_path + "/manage/group/deleteGroupList/"+data.id;
                        getAjax(url, function(data) {
                            if(data.code == 0){
                                alert(data.msg);
                                terminalTab('','',pageNum,pageSize);
                            }else if(data.code == -1){
                                unauthorized(data.code);
                            }else{
                                alert(data.msg);
                            }
                        })
                        layer.close(index); //向服务端发送删除指令
                    });
                }
            });
        });
        $('#group_btn_add').on('click',function(){
            var url = "add_topgroup.html?type=add";
            frame('添加分组信息',url,'groupManage');
        })
    }
})