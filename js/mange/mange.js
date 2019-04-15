$(function () {
    // 删除暂存session数据
    sessionStorage.removeItem('file');
    sessionStorage.removeItem('checkUser');
    var HTlogin = sessionStorage.getItem('HTlogin');
    if(HTlogin){
        var at = JSON.parse(HTlogin).data.token;
    }
    // 判断渲染模块
    function showModular(){
        var modular = sessionStorage.getItem('modular');
        if(modular == 'permissionAssignment'){          //用户信息
            $('#permissionAssignment').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'yhgl'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            permissionAssignment();
        }else if(modular == 'police'){              //报警级别
            $('#police_box').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'fwpz'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            police();
        }else if(modular == 'upgrade'){         //升级维护
            $('#upgradeMaintenance').show().siblings().hide();
            $('.btn').each(function(){
                if($(this).attr('name') == 'sjwh'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            upgradeMaintenance();
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
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        // if($(this).attr('name') == 'yhgl'){
        // 	$('#user').show().siblings().hide();
        // 	user();
        // }
        if ($(this).attr('name') == 'dtpz') {
            $('#mapid').show().siblings().hide();
            map();
        }
        if ($(this).attr('name') == 'zdpz') {
            $('#terminalConfigure').show().siblings().hide();
            terminalConfigure();
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
            upgradeMaintenance();
        }
    });
    $('.server').on('click', function () { // 接入服务器配置
        $('#server').show().siblings().hide();
        server();
    });

    $('.police').on('click', function () { // 报警等级设定
        $('#police_box').show().siblings().hide();
        police();
    });
    $('.userInformation').on('click', function () { // 用户信息
        $('#userInformation').show().siblings().hide();
        userInformation();
    });

    $('.permissionAssignment').on('click', function () { // 权限分配
        $('#permissionAssignment').show().siblings().hide();
        permissionAssignment();
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
    function server() {
        layui.use('table', function () {
            table = layui.table //表格

            //执行一个 table 实例
            table.render({
                elem: '#service',
                url: '' //数据接口
                    ,
                title: '服务配置',
                page: true //开启分页
                    ,
                toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                    // ,totalRow: true //开启合计行
                    ,
                parseData: function (data) {
                    return {
                        'code': data.code,
                        'msg': data.msg,
                        // 'data': data.data.list
                    }
                },
                cols: [[ //表头
                    // {type: 'checkbox', fixed: 'left'}
                    {
                        field: 'username',
                        title: '服务器IP',
                        width: '16.6%',
                        align: 'center'
                    }
                    , {
                        field: 'remarks',
                        title: '客户端口',
                        width: '12.6%',
                        align: 'center'
                    }
                    , {
                        field: 'remarks',
                        title: '设备端口',
                        width: '12.6%',
                        align: 'center'
                    }
                    , {
                        field: 'remarks',
                        title: '接入终端数量',
                        width: '8%',
                        align: 'center'
                    }
                    , {
                        field: 'remarks',
                        title: '备注',
                        width: '39.33%',
                        align: 'center'
                    }
                    , {
                        field: 'url',
                        title: '操作',
                        width: '10.9%',
                        align: 'center',
                        toolbar: '#service_operation'
                    }
                ]]
            });
            //监听头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id),
                    data = checkStatus.data; //获取选中的数据
                switch (obj.event) {
                    case 'add':
                        window.location.href = "./add_user.html";
                        break;
                    case 'update':
                        if (data.length === 0) {
                            layer.msg('请选择一行');
                        } else if (data.length > 1) {
                            layer.msg('只能同时编辑一个');
                        } else {
                            update(checkStatus.data[0].id);
                        }
                        break;
                    case 'delete':
                        if (data.length === 0) {
                            layer.msg('请选择一行');
                        } else if (data.length > 1) {
                            layer.msg('只能删除一个');
                        } else {
                            del(checkStatus.data[0].id);
                        }
                        break;
                };
            });

            //监听行工具事件
            table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                // var checkStatus = table.checkStatus(obj.config.id)
                if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        // obj.del(); //删除对应行（tr）的DOM结构
                        del(data.id);
                        layer.close(index);
                        //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    update(data.id, layEvent);
                }
            });

        });
    }
    // 服务配置---------------报警等级设定
    var limitcount = 10;
    var curnum = 1;
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
                        ,curr:curnum
                        ,limit:limitcount
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                curnum = obj.curr;
                                limitcount = obj.limit;
                                police(curnum,limitcount);
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
                                police(curnum,limitcount);
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
                    console.log(police_parms)
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
                searchCity();
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
        var layer = new L.TileLayer(url, {
            subdomains:"1234"
        });
        map.addLayer(layer);
        var marker = new L.marker([39.1410912411,117.0073575633]);
        marker.addTo(map);
        marker.bindPopup("<b>天津</b><br>西青区.");

        var marker = new L.marker([39.0850853357,117.1993482089]);
        marker.addTo(map);
        marker.bindPopup("<b>天津</b>");

    }

    // 终端配置
    function terminalConfigure(){
        layui.use('table', function () {
            var table = layui.table;

            table.render({
                elem: '#terminal',
                url: '' //数据接口
                    ,
                title: '终端配置',
                page: true //开启分页
                    ,
                cellMinWidth: 80,
                parseData: function (res) {
                    return {
                        'code': res.code,
                        'msg': res.msg,
                        // 'data': res.data.list
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
                        title: '时间',
                        width: '33.33%'
                    }
                ]]
            });
        });
    }

    
    // 用户信息
    var page=1,limit=10;
    function userInformation(page,limit) {
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
                    'pageNum':page,
                    'pageSize':limit
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
                    }else{
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
                        width: '10.5%',
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
                        width: '14.5%',
                        align: 'center'
                    }
			     	, {
                        field: 'url',
                        title: '照片信息',
                        width: '15.5%',
                        align: 'center',
                        toolbar: '#imgUrl'
                    }
			     	, {
                        fixed: 'right',
                        title: '操作',
                        width: '15.5%',
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
                        ,curr:page
                        ,limit:limit
                        ,layout: ['prev', 'page', 'next', 'skip','count']
                        ,jump:function (obj,first) {
                            if(!first){
                                page = obj.curr;
                                limit = obj.limit;
                                userInformation(page,limit);
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
                            update(checkStatus.data[0].id);
                        }
                        break;
                    case 'delete':
                        if (data.length === 0) {
                            layer.msg('请选择一行');
                        } else if (data.length > 1) {
                            layer.msg('只能删除一个');
                        } else {
                            del(checkStatus.data[0].id);
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
                        del(data.id);
                        layer.close(index); //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    update(data.id, layEvent);
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
                    console.log(body);
                    console.log(w);
                    console.log(index);
                    console.log(body.find('.username').val());
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
                }
            });
        })
    }
    // 编辑用户信息
    function update(id, layEvent) {
        var url = global_path + "/manage/user/checkUser?id="+id;
        getAjax(url, function(data) {
            if (data.code == 0) {
                sessionStorage.setItem('checkUser', JSON.stringify(data));
                var url = "user.html?layEvent=" + layEvent + "&userID=" + id;
                frame('编辑用户信息',url,'userInformation');
            } else if(data.code == 401){
                unauthorized(data.code);
            } else {
                alert(data.msg);
            }
        })
    }
    // 删除用户信息
    function del(id) {
        var url = global_path + "/manage/user/deleteUser?id="+id;
        getAjax(url, function(data) {
            if(data.code == 0){
                alert(data.msg);
                userInformation(page,limit);
            }else if(data.code == 401){
                unauthorized(data.code);
            }
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
    // 权限分配
    function permissionAssignment() {
        layui.use('table', function () {
            table = layui.table //表格

            //执行一个 table 实例
            table.render({
                elem: '#permission',
                url: '' //数据接口
                    ,
                title: '权限',
                page: true //开启分页
                    ,
                toolbar: '#addBtn' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                    ,
                parseData: function (data) {
                    return {
                        'code': data.code,
                        'msg': data.msg,
                        'data': data.data.list
                    }
                },
                cols: [[ //表头
			      	// {type: 'checkbox', fixed: 'left'}
                    {
                        field: 'id',
                        title: 'ID',
                        width: '20%',
                        align: 'center'
                    }
                    , {
                        field: 'username',
                        title: '角色',
                        width: '20%',
                        align: 'center'
                    }
			      	, {
                        field: 'remarks',
                        title: '备注',
                        width: '20%',
                        align: 'center'
                    }
                    , {
                        field: 'functionName',
                        title: '权限',
                        width: '20%',
                        align: 'center'
                    }
			      	, {
                        field: 'url',
                        title: '操作',
                        width: '20%',
                        align: 'center',
                        toolbar: '#permission_operation'
                    }
			    ]]
            });
            //监听头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id),
                    data = checkStatus.data; //获取选中的数据
                switch (obj.event) {
                    case 'add':
                        window.location.href = "./add_power.html";
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
                        var parms = {
                            'id': data.id
                        }
                        var url = global_path + "/deleteOne";
                        commonAjax(url, parms, function (data) {
                            if (data.code == 0) {
                                permissionAssignment();
                                alert(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        })
                        layer.close(index);
                        //向服务端发送删除指令
                    });
                } else if (layEvent === 'edit') {
                    var parms = {
                        'id': data.id
                    }
                    var url = global_path + "/selectOne";
                    commonAjax(url, parms, function (data) {
                        if (data.code == 0) {
                            permissionAssignment();
                            alert(data.msg);
                        } else {
                            alert(data.msg);
                        }
                    })
                }
            });

        });
    }
    // 操作日志
    function oplog() {
        var pageNum = 1,pageSize = 10,startTime = '', endTime = '';
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
            if (startTime == '') {
                alert('请选择起始时间');
            } else if (endTime == '') {
                alert('请选择结束时间');
            } else {
                startTime = Date.parse(startTime);
                endTime = Date.parse(endTime);
                showLog(startTime, endTime,pageNum,pageSize);
            }
        })
    }
    // 升级维护
    function upgradeMaintenance() {
        layui.use(['table', 'upload'], function () {
            var upload = layui.upload;
            table = layui.table //表格

            //执行一个 table 实例
            table.render({
                elem: '#upgrade',
                url: global_path + '/manage/version/selectVersionInfo', //数据接口
                headers: {
                    'at': at
                },
                title: '升级维护',
                page: true //开启分页
                    ,
                parseData: function (res) {
                    if(res.code == 0){
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            'data': res.data
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
			    ]]
            });
            function request(id){
                var parms = {
                    'id' : id
                }
                $.ajax({
                    type: "post",
                    url: global_path + '/manage/user/downLoad',
                    data: parms,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("at",at);
                    },
                    success: function (res) {
                        if(res.code == 0){
                            // window.open或者a标签下载 
                            var isSupportDownload = 'download' in document.createElement('a');
                            if(isSupportDownload){
                                var $a = $("<a>") ;
                                $a.attr({href:res.data.url,download:res.data.filename}).hide().appendTo($("body"))[0].click();
                            }else{
                               window.open(res.data.url);
                            }
                        }else if (res.code == 401){
                            unauthorized(res.code);
                        }else{
                          alert(res.msg);
                        }
                    }
                })
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