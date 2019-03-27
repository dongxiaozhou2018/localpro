$(function(){
	// 点击事件
    $('.layui-side-scroll').on('click','.btn',function(){		//左侧导航栏
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
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

    layui.use('table', function(){
	  	var table = layui.table;
		  
		  //第一个实例
	  	table.render({
		    elem: '#demo'
		    ,height: 312
		    ,url: '../js/data.js' //数据接口
		    ,page: true //开启分页
		    ,cols: [[ //表头
		      {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
		      ,{field: 'username', title: '用户名', width:80}
		      ,{field: 'sex', title: '性别', width:80, sort: true}
		      ,{field: 'city', title: '城市', width:80} 
		      ,{field: 'sign', title: '签名', width: 177}
		      ,{field: 'experience', title: '积分', width: 80, sort: true}
		      ,{field: 'score', title: '评分', width: 80, sort: true}
		      ,{field: 'classify', title: '职业', width: 80}
		      ,{field: 'wealth', title: '财富', width: 135, sort: true}
		    ]]
		});
		  
	});
//  地图
 //    var map = L.map('mapid', {
	//     center: [51.505, -0.09],
	//     zoom: 13,
	//     zoomControl:true
	// });


 //    var cities = L.layerGroup();

	// L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
	// L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
	// L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
	// L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


	// var mbAttr = '',
	// 	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	// var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
	// 	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

	// var map = L.map('mapid', {
	// 	center: [39.73, -104.99],
	// 	zoom: 10,
	// 	layers: [grayscale, cities],
	// 	zoomControl: true,
	// 	zoomSnap: 0.25
	// });
	// map.zoomControl.setPosition('topleft');
	// map.invalidateSize(true);
	// var baseLayers = {
	// 	"Grayscale": grayscale,
	// 	"Streets": streets
	// };

	// var overlays = {
	// 	"Cities": cities
	// };

	// L.control.layers(baseLayers, overlays).addTo(map);



     // 基于准备好的dom，初始化echarts实例
 //    var myChart = echarts.init(document.getElementById('main'));
 //    var aaa = [
	//                 {value:335, name:'直接访问'},
	//                 {value:310, name:'邮件营销'},
	//                 {value:234, name:'联盟广告'},
	//                 {value:135, name:'视频广告'},
	//                 {value:1548, name:'搜索引擎'}
	//             ];
 //    // var data = genData(50);
 //    option = {
	//     title : {
	//         text: '运维箱安全事态（事件类型）',
	//         x: 'center'
	//     },
	//     tooltip: {
	//         trigger: 'item',
	//         formatter: "{a} <br/>{b} : {c} ({d}%)"
	//     },
	//     legend: {
	//         orient: 'vertical',
	//         left: 'left',
	//         data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
	//     },
	//     series : [
	//         {
	//             name: '事件类型',
	//             type: 'pie',
	//             radius : '55%',
	//             center: ['50%', '60%'],
	//             data:aaa,
	//             itemStyle: {
	//                 emphasis: {
	//                     shadowBlur: 10,
	//                     shadowOffsetX: 0,
	//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
	//                 }
	//             }
	//         }
	//     ]
	// };



	// function genData(count) {
	//     var nameList = [
	//         '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
	//     ];
	//     var legendData = [];
	//     var seriesData = [];
	//     var selected = {};
	//     for (var i = 0; i < 50; i++) {
	//         name = Math.random() > 0.65
	//             ? makeWord(4, 1) + '·' + makeWord(3, 0)
	//             : makeWord(2, 1);
	//         legendData.push(name);
	//         seriesData.push({
	//             name: name,
	//             value: Math.round(Math.random() * 100000)
	//         });
	//         selected[name] = i < 6;
	//     }

	//     return {
	//         legendData: legendData,
	//         seriesData: seriesData,
	//         selected: selected
	//     };

	//     function makeWord(max, min) {
	//         var nameLen = Math.ceil(Math.random() * max + min);
	//         var name = [];
	//         for (var i = 0; i < nameLen; i++) {
	//             name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
	//         }
	//         return name.join('');
	//     }
	// }
	// 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
})

