$(function () {
    // 判断渲染模块
    function showModular(){
        var modular = getQueryString("modular");
        if(modular == 'userInformation'){
            $('#userInformation').show().siblings().hide();
        }else if(modular == 'permissionAssignment'){
            $('#permissionAssignment').show().siblings().hide();
        }else{
            $('#terminalData').show().siblings().hide();
        }
    }
    showModular();
    // 点击事件
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
        if ($(this).attr('name') == 'zdzl') {
            $('#terminalData').show().siblings().hide();
            echart();
        }
        if ($(this).attr('name') == 'czrz') {
            $('#oplog').show().siblings().hide();
            oplog();
        }
        if ($(this).attr('name') == 'fwpz') {
            $('#serviceConfiguration').show().siblings().hide();
            serviceConfiguration();
        }
        if ($(this).attr('name') == 'sjwh') {
            $('#upgradeMaintenance').show().siblings().hide();
            upgradeMaintenance();
        }
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
        $.getJSON(global_path + "/logout", function (data) {
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
                'passwordOld': oldPwd,
                'passwordNew': newPwd
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

    // 服务配置
    function serviceConfiguration() {
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
                        window.location.href = "./add.html";
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

    // 地图配置
    function map() {
        // var cities = L.layerGroup();

        // L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
        //     L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
        //     L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
        //     L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


        // var mbAttr = '',
        //     mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

        // var grayscale = L.tileLayer(mbUrl, {
        //         id: 'mapbox.light',
        //         attribution: mbAttr
        //     }),
        //     streets = L.tileLayer(mbUrl, {
        //         id: 'mapbox.streets',
        //         attribution: mbAttr
        //     });

        // var map = L.map('mapid', {
        //     center: [39.0851000000,117.1993700000],
        //     zoom: 10,
        //     layers: [grayscale, cities],
        //     zoomControl: true,
        //     zoomSnap: 0.25
        // });
        // map.zoomControl.setPosition('topleft');
        // map.invalidateSize(true);
        // var baseLayers = {
        //     "Grayscale": grayscale,
        //     "Streets": streets
        // };

        // var overlays = {
        //     "Cities": cities
        // };

        // L.control.layers(baseLayers, overlays).addTo(map);


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

		// marker.openPopup();
        // var wmsLayer= L.tileLayer.wms("http://localhost:8080/geoserver/cite/wms?", {
        //     layers: 'cite:bou2_4p',//需要加载的图层
        //     format: 'image/png',//返回的数据格式
        //     transparent: true,
        //     //crs: L.CRS.EPSG4326
        // });
        // map.addLayer(wmsLayer);
    }

    // 用户管理
    function user() {
        layui.use('element', function () {
            var element = layui.element;
        });
    }
    user();
    // 用户信息
    function userInformation() {
        layui.use('table', function () {
            table = layui.table //表格

            //执行一个 table 实例
            table.render({
                elem: '#demo',
                url: global_path + '/manageUsers' //数据接口
                    ,
                title: '用户表',
                page: true //开启分页
                    ,
                toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                    // ,totalRow: true //开启合计行
                    ,
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
                            'code': data.code,
                            'msg': data.msg,
                            'data': res.data.list
                        }
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
                        width: '5%',
                        sort: true,
                        fixed: 'left',
                        align: 'center'
                    }
			     	, {
                        field: 'username',
                        title: '用户名',
                        width: '12.5%',
                        align: 'center'
                    }
			     	, {
                        field: 'role',
                        title: '类型',
                        width: '12.5%',
                        sort: true,
                        align: 'center'
                    }
			     	, {
                        field: 'dept',
                        title: '部门',
                        width: '12.5%',
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
                        sort: true,
                        align: 'center',
                        toolbar: '#imgUrl'
                    }
			     	, {
                        fixed: 'right',
                        title: '操作',
                        width: '12.5%',
                        align: 'center',
                        toolbar: '#barDemo'
                    }
			    ]]
            });
            //渲染搜索列表
            function searchCity() {
                var searchCityName = $("#demoReload").val();
                var select_type = $('.select_type').val();
                if (searchCityName == "" && select_type == '') {
                    $("tr").show();
                } else {
                    $("td").each(function () {
                        if ($(this).attr('data-field') == 'id') {
                            var id = $(this).find('.layui-table-cell').text();
                            if (id.indexOf(searchCityName) != -1) {
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                        if ($(this).attr('data-field') == 'role') {
                            var role = $(this).find('.layui-table-cell').text();
                            if (role.indexOf(select_type) != -1) {
                                $(this).parents('tr').show();
                            } else {
                                $(this).parents('tr').hide();
                            }
                        }
                    });
                }
            }
            $('#demoReload').bind('input', function () {
                searchCity();
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
                if (layEvent === 'detail') {
                    update(data.id, layEvent);
                } else if (layEvent === 'del') {
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
    // 编辑用户信息
    function update(id, layEvent) {
        var parms = {
            'id': id
        }
        var url = global_path + "/checkUser";
        commonAjax(url, parms, function (data) {
            if (data.code == 0) {
                localStorage.setItem('checkUser', JSON.stringify(data));
                window.location.href = "./update_user.html?layEvent=" + layEvent + "&userID=" + id;
            } else {
                alert(data.msg);
            }
        })
    }
    // 删除用户信息
    function del(id) {
        var parms = {
            'id': id
        }
        var url = global_path + "/deleteUser";
        commonAjax(url, parms, function (data) {
            if (data.code == 0) {
            	userInformation();
                alert(data.msg);
            } else {
                alert(data.msg);
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
                    // ,totalRow: true //开启合计行
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
                // var checkStatus = table.checkStatus(obj.config.id)
                if (layEvent === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        // obj.del(); //删除对应行（tr）的DOM结构
                        // del(data.id);
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
        function showLog(startTime1, endTime1) {
            layui.use('table', function () {
                var table = layui.table;

                table.render({
                    elem: '#test',
                    url: global_path + '/selectRecordInfo' //数据接口
                        ,
                    where: {
                        startTime: startTime1,
                        endTime: endTime1
                    },
                    title: '操作日志',
                    page: true //开启分页
                        ,
                    toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        // ,totalRow: true //开启合计行
                        // ,width : '90%'
                        ,
                    cellMinWidth: 80,
                    parseData: function (res) {
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            'data': res.data.list
                        }
                    },
                    cols: [[ //表头
		      		// {type: 'checkbox', fixed: 'left'}
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
        showLog('', '');
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
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            if (startTime == '') {
                alert('请选择起始时间');
            } else if (endTime == '') {
                alert('请选择结束时间');
            } else {
                showLog(startTime, endTime);
            }
        })
    }
    // 升级维护
    function upgradeMaintenance() {
        layui.use('table', function () {
            table = layui.table //表格

            //执行一个 table 实例
            table.render({
                elem: '#upgrade',
                url: '' //数据接口
                    ,
                title: '升级维护',
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
                        title: '版本名称',
                        width: '15%',
                        align: 'center'
                    }
			      	, {
                        field: 'remarks',
                        title: '上传时间',
                        width: '20%',
                        align: 'center'
                    }
			      	, {
                        field: 'remarks',
                        title: '版本说明',
                        width: '50%',
                        align: 'center'
                    }
			      	, {
                        field: 'url',
                        title: '操作',
                        width: '15%',
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
                        window.location.href = "./add.html";
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
})