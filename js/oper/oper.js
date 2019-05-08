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
            // terminalConfigure(pageNum,pageSize);
        }else{
            $('.map_box').show().siblings().hide();
            mapFn();
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
            inspection(pageNum,pageSize,'天津市',false);
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
    // 管理界面渲染
    function user() {
        layui.use('element', function () {
            var element = layui.element;        //导航的hover效果、二级菜单等功能，需要依赖element模块
        });
    }
    user();

    // 数据总览
    overview();
    function overview(){
        // $('.overview iframe').attr('src','overview.html');
    }
    // 运维地图
    function mapFn() {
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


        function SquareOverlay(color, x, y,title) {
            // this._center = center;
            // this._length = length;
            this._length = 20;
            this._color = color;
            this._x = x;
            this._y = y;
            this._title = title;
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
            div.style.background = 'url(../../img/marker-icon0.png) no-repeat';
            div.style.borderRadius = this._length / 2 + "px";
            div.style.border = "solid rgb(" + this._length + "," + this._length + "," + this._length + ") 1px";
            // if (this._color == "red") {
            //     div.className = "btn-twinkle";
            // }
            div.onclick = function (e, a) {
                // map.openInfoWindow(new BMap.InfoWindow("地址：济南邦德激光股份公司", opts), new BMap.Point('117.684667', '36.233654')); //开启信息窗口
                debugger;
                var p = new BMap.Point(this._x, this._y);
                //var p1 = map.overlayPixelToPoint(e.screenX, e.screenY);
                //var p2 = map.pixelToPoint(e.pageX, e.pageY);
                map.openInfoWindow(new BMap.InfoWindow(this._title, opts), p); //开启信息窗口
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
            // var position = this._map.pointToOverlayPixel(this._center);
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
        debugger;
        var opts = {
            width: 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            title: "XXXXXXXXX", // 信息窗口标题
            enableMessage: true,//设置允许信息窗发送短息
            message: "XXXXXXXX"
        };
        // 添加自定义覆盖物

        // var spotAddress = '',lngLat = '';

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
                map.addOverlay(new SquareOverlay("red", p0, p1,markerArr[i].title));
            }else{
                map.addOverlay(new SquareOverlay("yellow", p0, p1,markerArr[i].title));
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
    function inspection(pageNum,pageSize,groupName,alarm) {
        $('.groupName').html('');
        var url = global_path + '/manage/group/groupOption';
        getAjax(url, function(res) {
            if (res.code == 0) {
                var firstmodel = '<option value="天津市">天津市</option>';
                $('.groupName').append(firstmodel);
                for(var i = 0;i<res.data.length;i++){
                    var groupName = '<option value="'+res.data[i].groupName+'">'+res.data[i].groupName+'</option>';
                    $('.groupName').append(groupName);
                }
            } else if(res.code == -1){
                unauthorized(res.code);
            } else {
                alert(res.msg);
            }
        })

        layui.use(['table','laypage','laydate'], function () {
            var table = layui.table,
                laydate=layui.laydate,
                laypage = layui.laypage;

            //执行一个 table 实例
            table.render({
                elem: '#inspection',
                url: global_path + '/systeminspectioncontroller/selectAll', //数据接口
                headers: {
                    'at': at
                },
                loading:true,
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize,
                    'groupName':groupName,
                    'alarm':alarm
                },
                title: '系统巡检',
                page: false,
                toolbar: '#toolbarDemo', //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                parseData: function (res) {
                    if(res.code == 0){
                        for(var i = 0;i<res.data.list.length;i++){
                            // P0E电流
                            var poeAlist = res.data.list[i].poeAlist[0].split(',');
                            for(var j = 0;j<poeAlist.length;j++){
                                res.data.list[i]['poeAlist'+(j+1)] = poeAlist[j];
                            }
                            // DC12V输出电流
                            var dc12vAlist = res.data.list[i].dc12vAlist[0].split(',');
                            for(var j = 0;j<dc12vAlist.length;j++){
                                res.data.list[i]['dc12vAlist'+(j+1)] = dc12vAlist[j];
                            }
                            
                            // AC24V输出电流
                            var ac24vAlist = res.data.list[i].ac24vAlist[0].split(',');
                            for(var j = 0;j<ac24vAlist.length;j++){
                                res.data.list[i]['ac24vAlist'+(j+1)] = ac24vAlist[j];
                            }
                            // 网络延时数据
                            var netdelayList = res.data.list[i].netdelayList[0].split(',');
                            for(var j = 0;j<netdelayList.length;j++){
                                res.data.list[i]['netdelayList'+(j+1)] = netdelayList[j];
                            }
                            // 带宽占用
                            var netbandList = res.data.list[i].netbandList[0].split(',');
                            for(var j = 0;j<netbandList.length;j++){
                                res.data.list[i]['netbandList'+(j+1)] = netbandList[j] + ' kbps';
                            }

                            // 设备状态
                            if(res.data.list[i].status == '0'){
                                res.data.list[i].status = '<span class="layui-btn">关闭</span>'
                            }else if(res.data.list[i].status == '1'){
                                res.data.list[i].status = '<span class="layui-btn layui-btn-normal">启用</span>'
                            }else if(res.data.list[i].status == '2'){
                                res.data.list[i].status = '<span class="layui-btn layui-btn-danger">报警</span>'
                            }else if(res.data.list[i].status == '3'){
                                res.data.list[i].status = '<span class="layui-btn layui-btn-warm">预警</span>'
                            }
                            // 撤防延时时间
                            if(res.data.list[i].doorduty == '0'){
                                res.data.list[i].doorduty = '<span class="layui-btn">布防</span>'
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
                        field: 'status',
                        title: '设备状态'
                    }
                    ,{
                        field: 'temp',
                        title: '机箱内温度'
                    }
                    ,{
                        field: 'groupName',
                        title: '地区'
                    }
                    , {
                        field: 'poeAlist1',
                        title: 'ETH_1电流'
                    }
                    ,{
                        field: 'poeAlist2',
                        title: 'ETH_2电流'
                    }
                    ,{
                        field: 'poeAlist3',
                        title: 'ETH_3电流'
                    }
                    , {
                        field: 'poeAlist4',
                        title: 'ETH_4电流'
                    }
                    ,{
                        field: 'poeAlist5',
                        title: 'ETH_5电流'
                    }
                    ,{
                        field: 'poeAlist6',
                        title: 'ETH_6电流'
                    }
                    , {
                        field: 'dc12vAlist1',
                        title: 'DC12V_1输出电流'
                    }
                    ,{
                        field: 'dc12vAlist2',
                        title: 'DC12V_2输出电流'
                    }
                    ,{
                        field: 'dc12vAlist3',
                        title: 'DC12V_3输出电流'
                    }
                    , {
                        field: 'dc48vA',
                        title: 'DC48V输出电流'
                    }
                    , {
                        field: 'dc48vinV',
                        title: 'DC48V输入电流'
                    }
                    , {
                        field: 'ac220vinV',
                        title: 'AC220V输出电压',
                        hide: true
                    }
                    , {
                        field: 'ac24vAlist1',
                        title: 'AC24V_1电流',
                        hide: true
                    }
                    , {
                        field: 'ac24vAlist2',
                        title: 'AC24V_2电流',
                        hide: true
                    }
                    , {
                        field: 'ac24vAlist3',
                        title: 'AC24V_3电流',
                        hide: true
                    }
                    , {
                        field: 'ac220vA',
                        title: 'AC220V输出电流',
                        hide: true
                    }
                    , {
                        field: 'ac220vA',
                        title: 'AC220V输出电流',
                        hide: true
                    }
                    ,{
                        field: 'netdelayList1',
                        title: 'ETH_1网络延迟',
                        hide: true
                    }
                    ,{
                        field: 'netdelayList2',
                        title: 'ETH_2网络延迟 ',
                        hide: true
                    }
                    , {
                        field: 'netdelayList3',
                        title: 'ETH_3网络延迟',
                        hide: true
                    }
                    ,{
                        field: 'netdelayList4',
                        title: 'ETH_4网络延迟',
                        hide: true
                    }
                    ,{
                        field: 'netdelayList5',
                        title: 'ETH_5网络延迟',
                        hide: true
                    }
                    
                    , {
                        field: 'netdelayList6',
                        title: 'ETH_6网络延迟',
                        hide: true
                    }
                    ,{
                        field: 'netdelayList7',
                        title: 'FC网络延迟',
                        hide: true
                    }
                    ,{
                        field: 'netbandList1',
                        title: 'ETH_1宽带占用',
                        hide: true
                    }
                    ,{
                        field: 'netbandList2',
                        title: 'ETH_2宽带占用 ',
                        hide: true
                    }
                    , {
                        field: 'netbandList3',
                        title: 'ETH_3宽带占用',
                        hide: true
                    }
                    ,{
                        field: 'netbandList4',
                        title: 'ETH_4宽带占用',
                        hide: true
                    }
                    ,{
                        field: 'netbandList5',
                        title: 'ETH_5宽带占用',
                        hide: true
                    }
                    , {
                        field: 'netbandList6',
                        title: 'ETH_6宽带占用',
                        hide: true
                    }
                    ,{
                        field: 'netbandList7',
                        title: 'FC宽带占用',
                        hide: true
                    }
                    ,{
                        field: 'fanspeed',
                        title: '风扇转速',
                        hide: true
                    }
                    , {
                        field: 'qkwh',
                        title: '用电总量',
                        hide: true
                    }
                    ,{
                        field: 'qkw',
                        title: '当前功率',
                        hide: true
                    }
                    ,{
                        field: 'type',
                        title: '设备类型',
                        hide: true
                    }
                    , {
                        field: 'simcsq',
                        title: 'sim卡信号质量',
                        hide: true
                    }
                    , {
                        field: 'doorduty',
                        title: '撤防延时时间',
                        hide: true
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
                    var groupName = $('.groupName');
                    var alarmcheck = $(".alarm").is(':checked');
                    if(alarmcheck){
                        var alarm = true;
                    }else{
                        var alarm = false;
                    }
                    //执行重载
                    table.reload('testReload', {
                        where: {
                            'groupName': groupName.val(),
                            'alarm':alarm
                        }
                    });
                }
            };
              
            $('.inspection_query').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
            $('.empty').on('click', function(){
                $('.groupName').val('天津市');
                $(".alarm_box").html('<input class="alarm" type="checkbox" name="alarm" value="只显示故障终端" />只显示故障终端');
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
                where:{
                    'pageNum':pageNum,
                    'pageSize':pageSize
                },
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
                            if(res.data.list[i].dealStatus == 0){       //  低
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-danger">未处理</span>';
                            }else if(res.data.list[i].dealStatus == 1){       //  低
                                res.data.list[i].dealStatus = '<span class="layui-btn">已派工</span>';
                            }else if(res.data.list[i].dealStatus == 2){        // 中
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-normal">已解决</span>';
                            }else if(res.data.list[i].dealStatus == 3){         //高
                                res.data.list[i].dealStatus = '<span class="layui-btn layui-btn-warm">已忽略</span>';
                            }
                            
                            // 报警时间
                            var alarmTime = new Date(res.data.list[i].alarmTime);
                            res.data.list[i].alarmTime = alarmTime.toLocaleDateString().replace(/\//g, "-") + " " + alarmTime.toTimeString().substr(0, 8);

                            // 处理时间
                            var dealTime = new Date(res.data.list[i].dealTime);
                            res.data.list[i].dealTime = dealTime.toLocaleDateString().replace(/\//g, "-") + " " + dealTime.toTimeString().substr(0, 8);
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
                        field: 'deviceId',
                        title: '设备ID'
                    }
                    ,{
                        field: 'deviceName',
                        title: '设备名称'
                    }
                    ,{
                        field: 'alarmType',
                        title: '报警类型'
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
                        title: '地址'
                    }
                    , {
                        fixed: 'right',
                        title: '操作',
                        align: 'center',
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

            //监听行工具事件
            table.on('tool(police)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data //获得当前行数据
                    ,
                    layEvent = obj.event; //获得 lay-event 对应的值
                if (layEvent === 'dispatched') {
                    var winUrl = 'dispatched.html?deviceId=' + data.id;
                    frame('派工',winUrl,'dispatched');
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
    }




    // 设备监控
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

                } else if(res.code == -1){
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
                        if(res.code == 0&&res.data.list.length>0){
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