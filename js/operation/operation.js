$(function(){
	// 点击事件
    $('.layui-side-scroll').on('click','.btn',function(){		//左侧导航栏
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
        if($(this).attr('name') == 'yhgl'){
        	$('#user').show().siblings().hide();
        	user();
        }
        if($(this).attr('name') == 'dtpz'){
        	$('#mapid').show().siblings().hide();
        	map();
        }
        if($(this).attr('name') == 'zdzl'){
        	$('#main').show().siblings().hide();
        	echart();
        }
    });
    $('.logout').on('click',function(){			//退出登录
    	$('#myalert').show();
    });
    $('#alertConfirm').on('click','.right',function(){			//退出登录弹框取消按钮
    	$('#myalert').hide();
    });
    $('#alertConfirm').on('click','.left',function(){			//退出登录弹框确认按钮
    	$('#myalert').hide();
        $.getJSON(global_path + "/logout", function(data) {
        	if(data.code == 0){
        		window.location.href = "../login.html";
        	}
        })
    });
    // 数据部分
    function echart(){
	 	// 基于准备好的dom，初始化echarts实例
	    var myChart = echarts.init(document.getElementById('main'));
	    var aaa = [
		                {value:335, name:'直接访问'},
		                {value:310, name:'邮件营销'},
		                {value:234, name:'联盟广告'},
		                {value:135, name:'视频广告'},
		                {value:1548, name:'搜索引擎'}
		            ];
	    option = {
		    title : {
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
		        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
		    },
		    series : [
		        {
		            name: '事件类型',
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:aaa,
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

    // 地图部分
    function map(){
    	var cities = L.layerGroup();

		L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
		L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
		L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
		L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


		var mbAttr = '',
			mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

		var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
			streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

		var map = L.map('mapid', {
			center: [39.73, -104.99],
			zoom: 10,
			layers: [grayscale, cities],
			zoomControl: true,
			zoomSnap: 0.25
		});
		map.zoomControl.setPosition('topleft');
		map.invalidateSize(true);
		var baseLayers = {
			"Grayscale": grayscale,
			"Streets": streets
		};

		var overlays = {
			"Cities": cities
		};

		L.control.layers(baseLayers, overlays).addTo(map);
    }
    
    // 用户部分
    function user(){
		layui.use('table', function(){
	  		table = layui.table //表格
			  
		  	//执行一个 table 实例
		  	table.render({
			    elem: '#demo'
			    ,url: global_path+'/manageUsers' //数据接口
			    ,title: '用户表'
			    ,page: true //开启分页
			    ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
			    // ,totalRow: true //开启合计行
			    ,parseData:function(data){
			    	return{
			    		'code': data.code,
			    		'msg': data.msg,
			    		'data': data.data.list
			    	}
			    }
			    ,cols: [[ //表头
			      {type: 'checkbox', fixed: 'left'}
			      ,{field: 'id', title: 'ID', width:120, sort: true, fixed: 'left'}
			      ,{field: 'username', title: '用户名', width:150, align:'center'}
			      ,{field: 'role', title: '类型', width: 100, sort: true,  align:'center'}
			      ,{field: 'dept', title: '部门', width: 130, sort: true,  align:'center'}
			      ,{field: 'telephone', title: '电话', width:200, align:'center'} 
			      ,{field: 'remarks', title: '备注信息', width: 200, align:'center'}
			      ,{field: 'url', title: '照片信息', width: 200, sort: true, align:'center', toolbar: '#imgUrl'}
			      ,{fixed: 'right', width: 250, align:'center', toolbar: '#barDemo'}
			    ]]
		  	});
	  	 	var $ = layui.$, active = {
			    reload: function(){
			      	var demoReload = $('#demoReload');
			      
			      //执行重载
	      			table.reload('testReload', {
				        page: {
				          curr: 1 //重新从第 1 页开始
				        }
				        ,where: {
				          key: {
				            id: demoReload.val()
				          }
				        }
			      	});
			    }
	  		};
			  
			  $('.demoTable .layui-btn').on('click', function(){
			    var type = $(this).data('type');
			    active[type] ? active[type].call(this) : '';
			  });
		  	//监听头工具栏事件
		  	table.on('toolbar(test)', function(obj){
			    var checkStatus = table.checkStatus(obj.config.id)
			    ,data = checkStatus.data; //获取选中的数据
			    switch(obj.event){
		      		case 'add':
		        		window.location.href = "./add.html";
		      		break;
	      			case 'update':
			        	if(data.length === 0){
			          		layer.msg('请选择一行');
			        	} else if(data.length > 1){
			          		layer.msg('只能同时编辑一个');
	        			} else {
	        				update(checkStatus.data[0].id);
			        	}
			      	break;
			      	case 'delete':
			       	 	if(data.length === 0){
			          		layer.msg('请选择一行');
			        	} else if(data.length > 1){
			          		layer.msg('只能删除一个');
	        			} else {
			          		del(checkStatus.data[0].id);
			        	}
			      	break;
			    };
		  	});
			  
		  	//监听行工具事件
		  	table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
			    var data = obj.data //获得当前行数据
			    ,layEvent = obj.event; //获得 lay-event 对应的值
			    // var checkStatus = table.checkStatus(obj.config.id)
			    if(layEvent === 'detail'){
			      	update(data.id,layEvent);
			    } else if(layEvent === 'del'){
			      	layer.confirm('真的删除行么', function(index){
			        	obj.del(); //删除对应行（tr）的DOM结构
			        	del(data.id);
			        	layer.close(index);
			        	//向服务端发送删除指令
			      	});
			    } else if(layEvent === 'edit'){
			      	update(data.id,layEvent);
			    }
		  	});
			  
		});
    }

	function update(id,layEvent){
		var parms = {
	        'id':id
	    }
	    var url = global_path + "/checkUser";
	    commonAjax(url,parms,function(data){
	        if(data.code == 0){
	        	localStorage.setItem('checkUser',JSON.stringify(data));
	        	window.location.href = "./update.html?layEvent="+layEvent+"&userID="+id;
	        }else{
	            alert(data.msg);
	        }
	    })
	}
	function del(id){
		var parms = {
	        'id':id
	    }
	    var url = global_path + "/deleteUser";
	    commonAjax(url,parms,function(data){
	        if(data.code == 0){
	        	alert(data.msg);
	        }else{
	            alert(data.msg);
	        }
	    })
	}

    
})

