$(function () {
    // websocket 连接参数
    var message = '';
    // var inspectionIndex;
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
        $('.layui-body').css('height','auto');
        if(oper == 'dispatched'){     //报警记录
            $('.overview').hide();
            $('#police_box').show().siblings().hide();
            $('#police_box').parent('div').show();
            $('.btn').each(function(){
                if($(this).attr('name') == 'bjjl'){
                    $(this).addClass('click_btn').parent('.layui-nav-item').siblings().find('a').removeClass('click_btn');
                }
            })
            var where = {
                'pageNum':pageNum,
                'pageSize':pageSize
            }
            police(where); 
           
        }else{
            $('.overview').show().siblings().hide();
            overview();
        }
    }
    showOper();
    // 点击事件
    $('.personal').on('click',function(){
        var url = "../personal.html";
        frame('编辑个人信息',url);
    });
    $('.layui-side-scroll').on('click', '.btn', function () { //左侧导航栏
        
        pageNum = 1; pageSize = 10;
        sessionStorage.removeItem('oper');
        $('.layui-body').css('bottom','44px');
        $('.layui-body').css('height','auto');
        $('.content_box').css('padding','15px');
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        if ($(this).attr('name') == 'zl') {
            var v = Math.random();
            $('.overview iframe').attr('src','overview.html?v=' + v);
            $('.overview').show().siblings().hide();
            $('.layui-body').css('bottom','0');
            $('.content_box').css('padding','0');
            overview();
        }
        if ($(this).attr('name') == 'ywdt') {
            $('.overview').hide();
            $('.map_box').show().siblings().hide();
            $('.map_box').parent('div').show();
            mapFn();
        }
        if ($(this).attr('name') == 'sbjk') {
            $('.overview').hide();
            $('#terminalConfigure').show().siblings().hide();
            $('#terminalConfigure').parent('div').show();
            $('.layui-body').css('bottom','0');
            $('.content_box').css('padding','0');
            // terminalConfigure(pageNum,pageSize);
        }
        if ($(this).attr('name') == 'xtxj') {
            $('.overview').hide();
            $('#inspection_box').show().siblings().hide();
            $('#inspection_box').parent('div').show();
            inspection(pageNum,pageSize,'');
        }
        if ($(this).attr('name') == 'bjjl') {
            $('.overview').hide();
            $('#police_box').show().siblings().hide();
            $('#police_box').parent('div').show();
            var where = {
                'pageNum':pageNum,
                'pageSize':pageSize
            }
            police(where);
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
        message = {
            "devid":"",
            "cmd":2,
            "result":0,
            "data":null
        }
        $('#websocket')[0].contentWindow.send(message);
        getAjax(global_path + "/logout", function (data) {
            if (data.code == 0) {
                sessionStorage.removeItem('HTlogin');
                $('#websocket')[0].contentWindow.closeWebSocket();
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
                    unauthorized(data.code);
                } else {
                    alert(data.msg);
                }
            })
        }
    });

    //   总览数据
    $('.full_btn').on('click',function(){
        $('.full_overview iframe').attr('src','overview.html');
        $('.overview').hide();
        $('.full_overview').show();
        var v = Math.random();
        $('.full_overview iframe').attr('src','overview.html?v=10');
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
        $('.overview iframe').attr('src','overview.html?v=20');
    })

    // 地图查询、分组树显示
    $('.map_box').on('click','.show_list',function(){
        
        if($('.show_list').find('i').hasClass('layui-icon-next')){
            $('#terminal_tree').show();
            $('.show_list').css('left','18%');
            $('.Identification').css('left','19%');
            $('.show_list').html('<i class="layui-icon layui-icon-search layui-icon-prev"></i> 设备地址');
            // $('.show_list').find('i').removeClass('layui-icon-next').addClass('');
        }else{
            $('#terminal_tree').hide();
            $('.show_list').css('left','0');
            $('.Identification').css('left','10px');
            $('.show_list').html('设备地址 <i class="layui-icon layui-icon-search layui-icon-next"></i>');
            // $('.show_list').find('i').removeClass('layui-icon-prev').addClass('layui-icon-next');
        }
        
    })
    $('.Identification3').on('click','img',function(){
        mapFn();
    })

    // 报警弹框关闭按钮
    $('.close').on('click','i',function(){
        $('.police_alt').hide();
    })
    // 管理界面渲染
    function user() {
        layui.use('element', function () {
            var element = layui.element;        //导航的hover效果、二级菜单等功能，需要依赖element模块
        });
    }
    user();

    // 数据总览
    function overview(){
        // $('.overview iframe').attr('src','overview.html');
        $('.layui-body').css('height','105%');
        $('.layui-body').css('bottom','0');
    }
    // 运维地图
    function mapFn() {
        $('.layui-body').css('bottom','0');


        function SquareOverlay(color, x, y,markerArr) {
            this._length = 20;
            this._color = color;
            this._x = x;
            this._y = y;
        }
        // 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();
        // 实现初始化方法
        SquareOverlay.prototype.initialize = function (map) {
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("canvas");
            div.style.position = "absolute";
            // 可以根据参数设置元素外观
            div.style.width = this._length + "px";
            div.style.height = this._length + "px";

            if (this._color == "red") {
                div.className = "btn-twinkle";
            }else{
                div.style.background = 'url(../../img/marker-icon0.png) no-repeat';
            }
            
            div.onclick = function (e, a) {

                var index = $(this).index();
                var p0 = markerArr[index].point.split(",")[0];
                var p1 = markerArr[index].point.split(",")[1];

                var p = new BMap.Point(p0,p1);
                
                //pop弹窗标题  
                var title = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + markerArr[index].title + '</div>';
                //pop弹窗信息  
                var html = [];
                html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
                html.push('<tr>');
                html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">地址:</td>');
                html.push('<td style="vertical-align:top;line-height:16px">' + markerArr[index].address + ' </td>');
                html.push('</tr>');
                html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">坐标:</td>');
                html.push('<td style="vertical-align:top;line-height:16px">' + markerArr[index].point + ' </td>');
                html.push('</tr>');
                html.push('</tbody></table>');
                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 100,     // 信息窗口高度
                    title : title , // 信息窗口标题
                }
                var infoWindow = new BMap.InfoWindow(html.join(""), opts);
                map.openInfoWindow(infoWindow,p);

            };
            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
            return div;
        }
        //实现绘制方法
        SquareOverlay.prototype.draw = function () {
            // 根据地理坐标转换为像素坐标，并设置给容器
            var position = this._map.pointToOverlayPixel(new BMap.Point(this._x, this._y));
            this._div.style.left = position.x - this._length / 2 + "px";
            this._div.style.top = position.y - this._length / 2 + "px";
        }
        // 实现显示方法
        SquareOverlay.prototype.show = function () {
            if (this._div) {
                this._div.style.display = "";
            }
        }
        // 实现隐藏方法
        SquareOverlay.prototype.hide = function () {
            if (this._div) {
                this._div.style.display = "none";
            }
        }
        // 添加自定义方法
        SquareOverlay.prototype.toggle = function () {
            if (this._div) {
                if (this._div.style.display == "") {
                    this.hide();
                }
                else {
                    this.show();
                }
            }
        }
        // 百度地图API功能
        var map = new BMap.Map("mapid", {
            enableMapClick: false
        });    // 创建Map实例
        map.centerAndZoom(new BMap.Point(117.190182,39.125596), 10);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        // map.setMapStyle({
        //     style: 'bluish'
        // });

        var markerArr = [{
                title: "名称：天津市西青区",
                point: "117.012247,39.139446",
                address: "天津市西青区",
                tel: "12306"
            },
            {
                title: "名称：天津市河东区",
                point: "117.226568,39.122125",
                address: "天津市河东区 ",
                tel: "18500000000"
            },
            {
                title: "名称：天津市东丽区",
                point: "117.313967,39.087764",
                address: "天津市东丽区",
                tel: "18500000000"
            },
            {
                title: "名称：天津市滨海新区",
                point: "117.654173,39.032846",
                address: "天津市滨海新区",
                tel: "18500000000"
            }];

        for(var i = 0;i<markerArr.length;i++){

            var p0 = markerArr[i].point.split(",")[0];
            var p1 = markerArr[i].point.split(",")[1];
            if(i == 0){
                map.addOverlay(new SquareOverlay("red", p0, p1,markerArr[i]));
            }else{
                map.addOverlay(new SquareOverlay("yellow", p0, p1,markerArr[i]));
            }
        }
        
        // 分组树
        layui.use(['table','tree','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage,
                tree = layui.tree,
                $ = layui.jquery;

            $('#map_tree').html('');
            var newTree = [];
            getAjax(global_path + "/manage/group/groupTree",function(res){
                if(res.code == 0){
                    newTree.push(res.data);
                    layui.tree({
                        elem: '#map_tree' //指定元素
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
                }else if(res.code == -1){
                    unauthorized(res.code);
                }else{
                    alert(res.msg);
                }
            })
        })
    }
    // 系统巡检

    function inspection(pageNum,pageSize,id) {
        // 巡检区域
        $('.groupName').html('');
        var url = global_path + '/manage/group/groupOption';
        getAjax(url, function(res) {
            if (res.code == 0) {
                var firstmodel = '<option value="">天津市</option>';
                $('.groupName').append(firstmodel);
                for(var i = 0;i<res.data.length;i++){
                    var groupNameOpt = '<option value="'+res.data[i].id+'">'+res.data[i].groupName+'</option>';
                    $('.groupName').append(groupNameOpt);
                }
            } else if(res.code == -1){
                unauthorized(res.code);
            } else {
                alert(res.msg);
            }
        })

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
        var systemList;
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#inspection',
                url: global_path + '/systeminspectioncontroller/OperSelectAll', //数据接口
                method: 'post',
                headers: {
                    'at': at
                },
                loading:true,
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
                title: '系统巡检',
                page: false,
                parseData: function (res) {
                    if(res.code == 0){
                        for (var i = 0; i < res.data.list.length; i++) {
                            if (res.data.list[i].status == 0) {
                                res.data.list[i].status = '<button class="layui-btn layui-btn-warm layui-btn-xs">不在线</button>';
                            } else if (res.data.list[i].status == 1) {
                                res.data.list[i].status = '<button class="layui-btn layui-btn-normal layui-btn-xs">在线</button>';
                            }
                        }
                        systemList = res.data.list;
                        return {
                            'code': res.code,
                            'msg': res.msg,
                            "count": res.data.total,
                            'data': res.data.list
                        }
                        for(var i = 0;i<systemList.length;i++){
                            if(systemList[i].subStatus == 0){
                                $('.subscribe')[i].show();
                                $('.unsubscribe')[i].hide();
                            }else if(systemList[i].subStatus == 1){
                                $('.subscribe')[i].hide();
                                $('.unsubscribe')[i].show();
                            }
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
                        field: 'modelName',
                        title: '设备型号'
                    }
                    , {
                        field: 'status',
                        title: '状态',
                        align: 'center',
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        align: 'center',
                        toolbar: '#toolbarDemo'
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
                                if(alarm){
                                    $(".alarm").attr('checked');
                                }
                                inspection(pageNum,pageSize,'');
                                return;
                            }
                        }
                    })
                },
                id: 'testReload'
            });
            var $ = layui.$, active = {
                reload: function(){
                    var groupId = $('.groupName').val();
                    var deviceId = $('.deviceId').val();
                    var deviceName = $('.deviceName').val();
                    var deviceIP = $('.deviceIP').val();
                    var modelId = $('.modelId').val();
                    var alarmcheck = $(".alarm").is(':checked');
                    if(alarmcheck){
                        alarm = true;
                    }else{
                        alarm = false;
                    }
                    //执行重载
                    table.reload('testReload', {
                        where: {
                            'id': groupId,
                            'deviceId': deviceId,
                            'deviceName': deviceName,
                            'deviceIP': deviceIP,
                            'modelId':modelId
                        }
                    });
                }
            };
              
            $('.inspection_query').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.groupName').val('');
                $('.deviceId').val('');
                $('.deviceName').val('');
                $('.deviceIP').val('');
                $('.modelId').val('');
                deviceId = '';
                deviceName = '';
                deviceIP = '';
                modelId = '';
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            table.on('tool(inspection)', function (obj) {
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'subscribe') {             // 订阅

                    //  判断是否有已订阅，如果有先取消订阅
                    for(var i = 0;i<systemList.length;i++){
                        if(systemList[i].subStatus == 1){
                            var message = {
                                "devid":systemList[i].deviceId,
                                "cmd": 30,
                                "data": null
                            }
                            $('#websocket')[0].contentWindow.send(message);

                            break;
                        }
                    }
                    // 订阅
                    var message = {
                        "devid":data.deviceId,
                        "cmd": 29,
                        "data": null
                    }
                    $('#websocket')[0].contentWindow.send(message);

                    // 限时10秒，如果10秒内websocket未有返回值，弹框提示
                    var a = setInterval(time, 1000); 
                    var num = 0;
                    function time() {
                        num++;
                        var onmessageData = $('#websocket')[0].contentWindow.onmessageData;
                        if(onmessageData&&onmessageData!=''){
                            $('.layui-side-scroll .btn').each(function (){
                                if($(this).attr('name') == 'sbjk'){
                                    $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
                                    $(this).addClass('click_btn').parents('li').siblings().removeClass('layui-this');
                                }
                            })
                            
                            $('.overview').hide();
                            $('#terminalConfigure').show().siblings().hide();
                            $('#terminalConfigure').parent('div').show();
                            $('.layui-body').css('bottom','0');
                            $('.content_box').css('padding','0');
                            $('.unsubscribe').hide();
                            $('.subscribe').show();
                            $(this).hide();
                            $(this).siblings().show();
                        }
                        if(num > 10 && !onmessageData){
                            clearTimeout(a);
                            alert('订阅失败，请重试。');
                        }
                    }

                }else if (layEvent === 'unsubscribe') {     // 取消订阅
                    var message = {
                        "devid":data.deviceId,
                        "cmd": 30,
                        "data": null
                    }
                    $('#websocket')[0].contentWindow.send(message);
                    $(this).siblings().show();
                    $(this).hide();
                }
            });
        });
    }


    // 报警记录

    // 定义查询变量
    var alarmLevel,police_groupName,alarmType,repairRname,beginTime,endTime,deviceName,dealStatus;
    function police(where) {

        // 所属区域
        $('.police_groupName').html('');
        var url = global_path + '/manage/group/groupOption';
        getAjax(url, function(res) {
            if (res.code == 0) {
                var firstmodel = '<option value="">天津市</option>';
                $('.police_groupName').append(firstmodel);
                for(var i = 0;i<res.data.length;i++){
                    var groupName = '<option value="'+res.data[i].id+'">'+res.data[i].groupName+'</option>';
                    $('.police_groupName').append(groupName);
                }
                $('.police_groupName').val(police_groupName);
            } else if(res.code == -1){
                unauthorized(res.code);
            } else {
                alert(res.msg);
            }
        })

        // 报警类型
        $('.alarmType').html('');
        var url = global_path + '/oper/alarmlevel/findAllAlarmType';
        getAjax(url, function(res) {
            if (res.code == 0) {
                var firstmodel = '<option value="">请选择报警类型</option>';
                $('.alarmType').append(firstmodel);
                if(res.data.length>0){
                    for(var i = 0;i<res.data.length;i++){
                        var mode = '<option value="'+res.data[i].alarmType+'">'+res.data[i].alarmName+'</option>';
                        $('.alarmType').append(mode);
                    }
                }
                $('.alarmType').val(alarmType);
            }
        })

        // 指派人员
        $('.repairRname').html('');
        var url = global_path + '/manage/user/findFixer';
        getAjax(url, function(res) {
            if (res.code == 0) {
                var firstmodel = '<option value="">请选择指派人员</option>';
                $('.repairRname').append(firstmodel);
                if(res.data.length>0){
                    for(var i = 0;i<res.data.length;i++){
                        var mode = '<option value="'+res.data[i].id+'">'+res.data[i].realName+'</option>';
                        $('.repairRname').append(mode);
                    }
                }
                $('.repairRname').val(repairRname);
            }
        })
        
        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#police',
                url: global_path + '/oper/alarmRecord/listPage', //数据接口
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
                where:where,
                title: '报警记录',
                page: false,
                parseData: function (res) {
                    if(res.code == 0){
                        for(var i=0;i<res.data.list.length;i++){

                            // 报警等级
                            if(res.data.list[i].alarmLevel == 1){       //  低
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-normal">低</span>';
                            }else if(res.data.list[i].alarmLevel == 2){        // 中
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-warm">中</span>';
                            }else if(res.data.list[i].alarmLevel == 3){         //高
                                res.data.list[i].alarmLevel = '<span class="layui-btn layui-btn-danger">高</span>';
                            }

                            // 处理状态
                            if(res.data.list[i].dealStatus == 0){       
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-danger">未处理</span>';
                                res.data.list[i].processState = 0;
                            }else if(res.data.list[i].dealStatus == 1){     
                                res.data.list[i].dealStatus = '<span class="layui-btn">已派工</span>';
                                res.data.list[i].processState = 1;
                            }else if(res.data.list[i].dealStatus == 2){      
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-normal">已解决</span>';
                                res.data.list[i].processState = 2;
                            }else if(res.data.list[i].dealStatus == 3){        
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-warm">已忽略</span>';
                                res.data.list[i].processState = 3;
                            }
                            
                            // 报警时间
                            if(res.data.list[i].alarmTime!=null){
                                var alarmTime = new Date(res.data.list[i].alarmTime);
                                res.data.list[i].alarmTime = alarmTime.toLocaleDateString().replace(/\//g, "-") + " " + alarmTime.toTimeString().substr(0, 8);
                            }
                            

                            // 处理时间
                            if(res.data.list[i].dealTime!=null){
                                var dealTime = new Date(res.data.list[i].dealTime);
                                res.data.list[i].dealTime = dealTime.toLocaleDateString().replace(/\//g, "-") + " " + dealTime.toTimeString().substr(0, 8);
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
                    ,{
                        field: 'deviceName',
                        title: '设备名称'
                    }
                    ,{
                        field: 'alarmLevel',
                        title: '报警等级',
                        align: 'center'
                    }
                    , {
                        field: 'alarmTime',
                        title: '报警时间'
                    }
                    , {
                        field: 'alarmContent',
                        title: '报警内容'
                    }
                    , {
                        field: 'dealStatus',
                        title: '处理状态',
                        align: 'center'
                    }
                    ,{
                        field: 'dealRname',
                        title: '处理人'
                    }
                    
                    , {
                        field: 'dealTime',
                        title: '处理时间'
                    }
                    ,{
                        field: 'repairRname',
                        title: '指派人员'
                    }
                    
                    , {
                        field: 'remarks',
                        title: '派工备注'
                    }
                    , {
                        field: 'groupName',
                        title: '所属区域'
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        align: 'center',
                        width: '10%',
                        toolbar: '#dispatched'
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
                                var where = {
                                    'pageNum':pageNum,
                                    'pageSize':pageSize,
                                    'alarmLevel': alarmLevel,
                                    'groupId': police_groupName,
                                    'alarmType':alarmType,
                                    'repairManId':repairRname,
                                    'startTime':beginTime,
                                    'endTime':endTime,
                                    'deviceName':deviceName,
                                    'dealStatus':dealStatus,
                                }
                                police(where);
                                $('.alarmLevel').val(alarmLevel);
                                $('#beginTime').val(beginTime);
                                $('#Deadline').val(endTime);
                                $('.deviceName').val(deviceName);
                                $('.dealStatus').val(dealStatus);
                            }
                        }
                    })
                },
                id: 'testReload'
            });
            var $ = layui.$, active = {
                reload: function(){
                    alarmLevel = $('.alarmLevel').val();
                    police_groupName = $('.police_groupName').val();
                    alarmType = $('.alarmType').val();
                    repairRname = $('.repairRname').val();
                    beginTime = $('#beginTime').val();
                    endTime = $('#Deadline').val();
                    deviceName = $('.deviceName').val();
                    dealStatus = $('.dealStatus').val();
                  //执行重载
                    table.reload('testReload', {
                        where: {
                            'alarmLevel': alarmLevel,
                            'groupId': police_groupName,
                            'alarmType':alarmType,
                            'repairManId':repairRname,
                            'startTime':beginTime,
                            'endTime':endTime,
                            'deviceName':deviceName,
                            'dealStatus':dealStatus,
                        }
                    });
                }
            };
              
            $('.police_query').on('click', function(){
                var beginTime = $('#beginTime').val();
                var endTime = $('#Deadline').val();
                
                if(beginTime!=''&&endTime==''){
                    alert('请选择截止时间');
                }else if(beginTime==''&&endTime!=''){
                    alert('请选择起始时间');
                }else if(endTime<beginTime){
                    alert('截止时间需晚于起始时间');
                }else{
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                }
                
            });
            $('.empty').on('click', function(){
                $('.alarmLevel').val('');
                $('.police_groupName').val('');
                $('.alarmType').val('');
                $('.repairRname').val('');
                $('#beginTime').val('');
                $('#Deadline').val('');
                $('.deviceName').val('');
                $('.dealStatus').val('');
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });

            //监听行工具事件
            table.on('tool(police)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'dispatched') {
                    var winUrl = 'dispatched.html?deviceId=' + data.id + '&dealStatus=' + data.processState;
                    frame('派工',winUrl,'dispatched');
                }else if(layEvent === 'solve'){
                    layer.confirm('确认解决？', function (index) {
                        var parms = {
                            'id':data.id,
                            'dealStatus':2
                        }
                        dealAlarm(parms);
                        layer.close(index);
                    });
                }else if(layEvent === 'ignore'){
                    layer.confirm('确认忽略？', function (index) {
                        var parms = {
                            'id':data.id,
                            'dealStatus':3
                        }
                        dealAlarm(parms);
                        layer.close(index);
                    });
                }
            });
        });
        //日期时间选择器
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#beginTime',
                type: 'datetime'
            });
            laydate.render({
                elem: '#Deadline',
                type: 'datetime'
            });
        });
        function dealAlarm(parms){
            commonAjax(global_path + "/oper/alarmRecord/dealAlarm",parms,function(res){
                if(res.code == 0){
                    alert(res.msg);
                    var where = {
                        'pageNum':pageNum,
                        'pageSize':pageSize
                    }
                    police(where);
                }else if(res.code == -1){
                    unauthorized(res.code);
                }else{
                    alert(res.msg);
                }
            })
        }
    }




    // 设备监控
    function terminalConfigure(){

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
                    url: global_path + '/oper/recordinfo/selectRecordInfo', //数据接口
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
                        }else{
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