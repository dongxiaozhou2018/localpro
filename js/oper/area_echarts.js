
$(function () {
    map();
    function map() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('map_1'));
        var data = [
            {name: '和平区', value: 69},
            {name: '河东区', value: 62},
            {name: '河西区', value: 62},
            {name: '南开区', value: 62},
            {name: '河北区', value: 64},
            {name: '红桥区', value: 85},
            {name: '东丽区', value: 86},
            {name: '西青区', value: 88},
            {name: '津南区', value: 88},
            {name: '北辰区', value: 89},
            {name: '武清区', value: 81},
            {name: '宝坻区', value: 81},
            {name: '滨海新区', value: 91},
            {name: '宁河区', value: 92},
            {name: '静海区', value: 93},
            {name: '蓟州区', value: 94},
            
        ];
        var geoCoordMap = {
            '和平区':[117.195907, 39.118327],
            '河东区':[117.226568, 39.122125],
            '河西区':[117.217536, 39.101897],
            '南开区':[117.164143, 39.120474],
            '河北区':[117.201569, 39.156632],
            '红桥区':[117.163301, 39.175066],
            '东丽区':[117.313967, 39.087764],
            '西青区':[117.012247, 39.139446],
            '津南区':[117.382549, 38.989577],
            '北辰区':[117.13482, 39.225555],
            '武清区':[117.057959, 39.376925],
            '宝坻区':[117.308094, 39.716965],
            '滨海新区':[117.654173, 39.032846],
            '宁河区':[117.82828, 39.328886],
            '静海区':[116.925304, 38.935671],
            '蓟州区':[117.407449, 40.045342]
        };
        
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };

        option = {
            tooltip : {
                trigger: 'item',
        		formatter: function (params) {
                      if(typeof(params.value)[2] == "undefined"){
                      	return params.name + ' : ' + params.value;
                      }else{
                      	return params.name + ' : ' + params.value[2];
                      }
                    }
            },
          
            geo: {
                map: '天津',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: false,//禁止其放大缩小
                itemStyle: {
                    normal: {
                        areaColor: '#4c60ff',
                        borderColor: '#002097'
                    },
                    emphasis: {
                        areaColor: '#293fff'
                    }
                }
            },
            series : [
                {
                    name: '消费金额',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[2] / 15;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ffeb7b'
                        }
                    }
                }
            ]
        };
        		
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }

})

