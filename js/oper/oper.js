$(function () {
    // 删除暂存session数据
    var HTlogin = sessionStorage.getItem('HTlogin');
    if(HTlogin){
        var at = JSON.parse(HTlogin).data.token;
    }
    var pageNum = 1,pageSize = 10;
    // 判断渲染模块
    function showOper(){
        pageNum = 1; pageSize = 10;
        var oper = sessionStorage.getItem('oper');
        $('.layui-body').css('bottom','44px');
        if(oper == 'police'){     //报警级别
            $('#police_box').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'bjjl'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            police(pageNum,pageSize); 
           
        }else if(oper == 'equipment'){         //设备监控
            $('#terminalConfigure').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'sbjk'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            terminalConfigure(pageNum,pageSize);
        }else{
            $('.map_box').show().siblings().hide();
            map();
        }
    }
    // showOper();
    // 点击事件
    $('.personal').on('click',function(){
        var url = "../personal.html";
        frame('编辑个人信息',url);
    });
    $('.layui-side-scroll').on('click', '.btn', function () { //左侧导航栏
        pageNum = 1; pageSize = 10;
        sessionStorage.removeItem('oper');
        $('.layui-body').css('bottom','44px');
        $('.content_box').css('padding','15px');
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        if ($(this).attr('name') == 'zl') {
            $('.overview').show().siblings().hide();
            $('.layui-body').css('bottom','0');
            $('.content_box').css('padding','0');
            overview();
        }
        if ($(this).attr('name') == 'ywdt') {
            $('.overview').hide();
            $('.map_box').show().siblings().hide();
            $('.map_box').parent('div').show();
            map();
        }
        if ($(this).attr('name') == 'sbjk') {
            $('.overview').hide();
            $('#terminalConfigure').show().siblings().hide();
            $('#terminalConfigure').parent('div').show();
            terminalConfigure(pageNum,pageSize);
        }
        if ($(this).attr('name') == 'xtxj') {
            $('.overview').hide();
            $('#inspection_box').show().siblings().hide();
            $('#inspection_box').parent('div').show();
            inspection(pageNum,pageSize);
        }
        if ($(this).attr('name') == 'bjjl') {
            $('.overview').hide();
            $('#police_box').show().siblings().hide();
            $('#police_box').parent('div').show();
            police(pageNum,pageSize);
        }
        if ($(this).attr('name') == 'czrz') {
            $('.overview').hide();
            $('#oplog').show().siblings().hide();
            $('#oplog').parent('div').show();
            oplog();
        }
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
                } else {
                    alert(data.msg);
                }
            })
        }
    });

    //   总览数据
    $('.full_btn').on('click',function(){
        $('.overview').hide();
        $('.full_overview').show();
        var full_width = $(window).width();
        var full_height = $(window).height();
        $('.full_overview').css({
            'width':full_width+'px',
            'height':full_height+'px'
        });
        window.onresize = function() {
            var full_width = $(window).width();
            var full_height = $(window).height();
            $('.full_overview').css({
                'width':full_width+'px',
                'height':full_height+'px'
            });
        }
    })

    $('.full_outbtn').on('click',function(){
        $('.overview').show();
        $('.full_overview').hide();
    })

    // 地图查询、分组树显示
    $('.map_box').on('click','.show_list',function(){
        
        if($('.show_list').find('i').hasClass('layui-icon-next')){
            $('#terminal_tree').show();
            $('.show_list').css('left','18%');
            $('.show_list').html('<i class="layui-icon layui-icon-search layui-icon-prev"></i> 设备地址');
            // $('.show_list').find('i').removeClass('layui-icon-next').addClass('');
        }else{
            $('#terminal_tree').hide();
            $('.show_list').css('left','0');
            $('.show_list').html('设备地址 <i class="layui-icon layui-icon-search layui-icon-next"></i>');
            // $('.show_list').find('i').removeClass('layui-icon-prev').addClass('layui-icon-next');
        }
        
    })
    // 管理界面渲染
    function user() {
        layui.use('element', function () {
            var element = layui.element;        //导航的hover效果、二级菜单等功能，需要依赖element模块
        });
    }
    user();

    // 数据总览
    overview()
    function overview(){

    }
    // 运维地图
    function map() {
        // var map = new L.Map("mapid", {
        //     zoom: 9,
        //     center: [39.0850853357,117.1993482089],
        //     boxZoom: true, 
        // });
        // var url = "http://webrd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
        // var layer = new L.TileLayer(url, {
        //     subdomains:"1234"
        // });
        // map.addLayer(layer);
        // var marker = new L.marker([39.1410912411,117.0073575633]);
        // marker.addTo(map);
        // marker.bindPopup("<b>天津</b><br>西青区.");

        // var marker = new L.marker([39.0850853357,117.1993482089]);
        // marker.addTo(map);
        // marker.bindPopup("<b>天津</b>");
        $('.layui-body').css('bottom','0');

        // var spotAddress = '',lngLat = '';

        var map = new BMap.Map("mapid",{enableMapClick:false});
    
    
        var point = new BMap.Point(117.216582,39.030182);
        map.centerAndZoom(point, 17);
        map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        map.enableContinuousZoom();
        var marker = new BMap.Marker(point);// 创建标注
        map.addOverlay(marker);             // 将标注添加到地图中
        // marker.enableDragging();            //可拖拽
        marker.disableDragging();           //不可拖拽
        marker.addEventListener("click",attribute);
        // map.addOverlay(marker);    //增加点

        function attribute(){
            var p = marker.getPosition();
            // 经纬度
            var point = new BMap.Point(p.lng, p.lat);
            var gc = new BMap.Geocoder();
            gc.getLocation(point, function (rs) {
                var addComp = rs.addressComponents;
                actual_address = rs.address;        //  位置信息

                var opts = {
                    width : 100, // 信息窗口宽度
                    height: 80, // 信息窗口高度
                    title : "您的位置是" , // 信息窗口标题
                    enableMessage:false,//设置允许信息窗发送短息
                }
                var infoWindow = new BMap.InfoWindow(rs.address+'('+p.lng+ ',' + p.lat+')', opts); // 创建信息窗口对象

                map.openInfoWindow(infoWindow,point); //开启信息窗口

                spotAddress = rs.address;
                lngLat = p.lng+ ',' + p.lat;
            })
        }
        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;
            // 分组树
            $('#terminal_demo').html('');
            var newTree = [];
            getAjax(global_path + "/manage/group/groupTree",function(res){
                if(res.code == 0){
                    newTree.push(res.data);
                    layui.tree({
                        elem: '#terminal_demo' //指定元素
                        ,click: function(item){ //点击最里层节点回调
                            // if(item.children.length == 0){
                            //     terminalTab(global_path + '/manage/device/listPage',item.id,pageNum,pageSize);
                            // }
                        }
                        ,nodes: menutree(newTree)
                    });
                }
            })
        })

    }
    // 系统巡检
    function inspection(pageNum,pageSize) {
        
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#inspection',
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
                title: '系统巡检',
                page: false,
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
                        field: 'alarmType',
                        title: '终端名称'
                    }
                    ,{
                        field: 'alarmName',
                        title: '终端状态'
                    }
                    
                    , {
                        field: 'alarmLevel',
                        title: '终端IP'
                    }
                    ,{
                        field: 'alarmType',
                        title: '所属区域'
                    }
                    ,{
                        field: 'alarmName',
                        title: '接入电压'
                    }
                    
                    , {
                        field: 'alarmLevel',
                        title: 'ETH_1电流'
                    }
                    ,{
                        field: 'alarmType',
                        title: 'ETH_2电流'
                    }
                    ,{
                        field: 'alarmName',
                        title: 'ETH_3电流'
                    }
                    
                    , {
                        field: 'alarmLevel',
                        title: 'ETH_4电流'
                    }
                    ,{
                        field: 'alarmType',
                        title: 'ETH_5电流'
                    }
                    ,{
                        field: 'alarmName',
                        title: 'ETH_6电流'
                    }
                    , {
                        field: 'alarmLevel',
                        title: 'DC12V_1电流'
                    }
                    ,{
                        field: 'alarmType',
                        title: 'DC12V_2电流'
                    }
                    ,{
                        field: 'alarmName',
                        title: 'DC12V_3电流'
                    }
                    
                    , {
                        field: 'alarmLevel',
                        title: 'DC48V电流'
                    }
                ]],
                done: function(res, curr, count){
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    laypage.render({
                        elem:'inspection_laypage'
                        ,count:count
                        ,curr:pageNum
                        ,limit:pageSize
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                pageNum = obj.curr;
                                pageSize = obj.limit;
                                inspection(pageNum,pageSize);
                            }
                        }
                    })
                },
                id: 'testReload'
            });
            var $ = layui.$, active = {
                reload: function(){
                    var inspection_role = $('.inspection_role');
                  
                  //执行重载
                    table.reload('testReload', {
                        url: global_path + '/alarmlevel/getAllByAlarmLevel',
                        where: {
                            'alarmLevel': inspection_role.val(),
                        }
                    });
                }
            };
              
            $('.inspection_query').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.inspection_role').val('全部');
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
        });
    }
    // 报警记录
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
                title: '报警记录',
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
                        url: global_path + '/alarmlevel/getAllByAlarmLevel',
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
        });
    }




    // 终端配置
    function terminalConfigure(){


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

                } else if(res.code == 401){
                    unauthorized(res.code);
                } else {
                    alert(res.msg);
                }
            })

            // 分组树
            $('#terminal_demo').html('');
            var newTree = [];
            getAjax(global_path + "/manage/group/groupTree",function(res){
                if(res.code == 0){
                    newTree.push(res.data);
                    layui.tree({
                        elem: '#terminal_demo' //指定元素
                        ,click: function(item){ //点击最里层节点回调
                            if(item.children.length == 0){
                                terminalTab(global_path + '/manage/device/listPage',item.id,pageNum,pageSize);
                            }
                        }
                        ,nodes: menutree(newTree)
                    });
                }
            })
            terminalTab('','',pageNum,pageSize);

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
                    id: 'testReload'
                });

            }
            var $ = layui.$, active = {
                reload: function(){
                    var deviceId = $('.deviceId').val();
                    var deviceName = $('.deviceName').val();
                    var deviceIP = $('.deviceIP').val();
                    var modelId = $('.modelId').val();
                    //执行重载
                    table.reload('testReload', {
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
                if(layEvent === 'control'){
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
                                sessionStorage.setItem('oper','equipment');
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
    }

    
    // 弹出层
    function frame(tit,url,oper){
        layui.use('layer', function(){ //独立版的layer无需执行这一句
            var $ = layui.jquery, layer = layui.layer;
            layer.open({
                type: 2 //此处以iframe举例
                    ,
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
                    sessionStorage.setItem('oper',oper);
                    layer.setTop(layero); //重点2
                },
                cancel: function(){ 
                    layer.closeAll();
                }
            });
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
        $('.empty').on('click', function () {
            $('#startTime').val('');
            $('#endTime').val('');
            startTime = '';
            endTime = '';
            showLog('', '',pageNum,pageSize);
        })
    }
})