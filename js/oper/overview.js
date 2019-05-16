$(function () {

    // var dateType = 'date';

    var dateType = 'month';

    function overView(searchTime){
        var url = global_path + '/getOverViewInfo';
        if(dateType == 'month'){
            var parms = {
                "range": "1"
            }
            parms.month = searchTime;
        }else if(dateType == 'date'){
            var parms = {
                "range": "0"
            }
            parms.searchTime = searchTime;
        }
        
        

        commonAjax(url,parms,function(res){
            if(res.code == 0){
                // 在线率
                var onLineRateStr = res.data.onLineRateStr||res.data.avrOnlineRate;
                var data = [
                    {
                        value: onLineRateStr.split('%')[0] - 0,
                        name: '在线'
                    },
                    {
                        value: (100 - onLineRateStr.split('%')[0]).toFixed(1),
                        name: '掉线'
                    }
                ]

                echarts_31(data,'fb1');

                // 故障处理自复率
                var data7 = [],data8 = [];
                var alarmRecordByGroup = res.data.alarmRecordSelfcures || res.data.alarmRecordSelfcures;
                for(var i = 0;i<alarmRecordByGroup.length;i++){
                    if(alarmRecordByGroup[i].selfcure == 0){

                        alarmRecordByGroup[i].selfcure = '故障自动修复率'

                    }else if(alarmRecordByGroup[i].selfcure == 1){

                        alarmRecordByGroup[i].selfcure = '人工修复率'
                    }
                    data7.push(alarmRecordByGroup[i].selfcure);
                    var alarmRecordByGroupList = {
                        value: alarmRecordByGroup[i].count,
                        name: alarmRecordByGroup[i].selfcure
                    };
                    data8.push(alarmRecordByGroupList);
                }

                echarts_32(data7,data8,'fb2','修复方式');

                // 设备故障类型占比
                var data1 = [],data2 = [];
                var alarmRecordByType = res.data.alarmRecordByType||res.data.alarmRecordByTypeList
                for(var i = 0;i<alarmRecordByType.length;i++){
                    data1.push(alarmRecordByType[i].alarmName);
                    var alarmRecord = {
                        value: alarmRecordByType[i].count||alarmRecordByType[i].alarmType,
                        name: alarmRecordByType[i].alarmName
                    };
                    data2.push(alarmRecord);
                }
                echarts_32(data1,data2,'fb3','故障处理比率');

                // 故障总量趋势
                var data3 = [],data4 = [];
                for(var i = 0;i<res.data.alarmRecordByMonths.length;i++){

                    data3.push(res.data.alarmRecordByMonths[i].alarmTime);
                    data4.push(res.data.alarmRecordByMonths[i].count);
                }
                echarts_1(data3,data4);

                // 故障区域分布
                var data5 = [],data6 = [];
                for(var i = 0;i<res.data.alarmRecordByGroupList.length;i++){

                    data5.push(res.data.alarmRecordByGroupList[i].groupName);
                    data6.push(res.data.alarmRecordByGroupList[i].count);
                }
                echarts_3(data5,data6);


            }else if(res.code == -1){
                unauthorized(res.code);
            }else{
                alert(res.msg);
            }
        })
    }
    var timeMonth = new Date().getMonth() + 1;
    
    if(timeMonth < 10) {
        timeMonth = '0' + timeMonth;
    }
    var timeYear = new Date().getFullYear();

    // var timeDate = new Date().getDate();

    // var times = timeYear + '-' + timeMonth + '-' + timeDate;

    var times = timeYear + '-' + timeMonth;
    // overView(times);









    
    
    echarts_33('fb4','故障类型');
    echarts_2();
    echarts_3();
    echarts_33('fb7','网略攻击类型分析');
    echarts_4();

    function echarts_31(data,id) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        option = {

            title: [{
                text: '在线率',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {

                top: '70%',
                itemWidth: 10,
                itemHeight: 10,
                data: ['在线', '掉线'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: '在线率',
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['40%', '60%'],
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: data
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_32(data1,data2,id,txt) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        option = {

            title: [{
                text: txt,
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {

                top: '70%',
                itemWidth: 10,
                itemHeight: 10,
                data: data1,
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: txt,
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['40%', '60%'],
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: data2
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_33(id,txt){
        var myChart = echarts.init(document.getElementById(id));

        option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            // legend: {
            //     orient: 'vertical',
            //     left: 'left',
            //     data: ['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8'],
            //     textStyle: {
            //         color: 'rgba(255,255,255,.5)',
            //         fontSize: '12',
            //     }
            // },
            series : [
                {
                    name:txt,
                    type:'pie',
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    radius: ['15%', '80%'],
                    center: ['50%', '55%'],
                    roseType : 'radius',
                    // label: {
                    //     normal: {
                    //         show: false
                    //     },
                    //     emphasis: {
                    //         show: true
                    //     }
                    // },
                    // lableLine: {
                    //     normal: {
                    //         show: false
                    //     },
                    //     emphasis: {
                    //         show: true
                    //     }
                    // },
                    data:[
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_1(data3,data4) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart1'));

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                },
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                

                data: data3

            }, {

                axisPointer: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                position: 'bottom',
                offset: 20,

            }],

            yAxis: [{
                type: 'value',
                boundaryGap: [0, '100%'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
                    },
                },

                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                }
            }],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {

                        normal: {
                            color: '#0184d5',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(1, 132, 213, 0.4)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(1, 132, 213, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0184d5',
                            // borderColor: 'rgb(255, 70, 131)',
                            // borderWidth: 12
                        }
                    },
                    data: data4

                }]

        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb5'));

        option = {
            title: [{
                text: '能耗统计',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            angleAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                        width: 1,
                        type: "solid"
                    },
                },
                axisLabel: {
                    interval: 0,
                    // rotate:50,
                    show: true,
                    splitNumber: 15,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
            },
            radiusAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                        width: 1,
                        type: "solid"
                    },
                },
                axisLabel: {
                    interval: 0,
                    // rotate:50,
                    show: true,
                    splitNumber: 15,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
                z: 10
            },
            polar: {
                center: ['50%', '57%'],
            },
            series: [{
                type: 'bar',
                data: [1, 2, 3, 4],
                coordinateSystem: 'polar',
                name: 'A',
                stack: 'a',
                itemStyle:{
                    color:'#065aab'
                }
            }, {
                type: 'bar',
                data: [2, 4, 6, 8],
                coordinateSystem: 'polar',
                name: 'B',
                stack: 'a',
                color: '#0682ab'
            }, {
                type: 'bar',
                data: [1, 2, 3, 4],
                coordinateSystem: 'polar',
                name: 'C',
                stack: 'a',
                color: '#06b4ab'
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb6'));

        option = {
            title: [{
                text: '故障区域分布',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0%',
                top: '20%',
                right: '0%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: ['周一','周二','周三','周四','周五','周六','周日'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                        width: 1,
                        type: "solid"
                    },
                },

                axisTick: {
                    show: false,
                },
                axisLabel: {
                    interval: 0,
                    // rotate:50,
                    show: true,
                    splitNumber: 15,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1 )",
                        width: 1,
                        type: "solid"
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                    }
                }
            }],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    stack: '总量',
                    barWidth: '35%', //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            color: '#0696ab',
                            opacity: 1,
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410],
                },
                {
                    name: '邮件营销',
                    type: 'bar',
                    stack: '总量',
                    barWidth: '35%', //柱子宽度
                    itemStyle: {
                        normal: {
                            color: '#065aab',
                            opacity: 1,
                        }
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },

            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart6'));
        var colors = ['#065aab', '#066eab', '#06a0ab'];

        option = {
            color: colors,

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                left: '0%',
                top: '20%',
                right: '0%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                        width: 1,
                        type: "solid"
                    },
                },

                axisTick: {
                    show: false,
                },
                axisLabel: {
                    interval: 0,
                    // rotate:50,
                    show: true,
                    splitNumber: 15,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "rgba(255,255,255,.1 )",
                        width: 1,
                        type: "solid"
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(255,255,255,.1)",
                    }
                }
            }],

            series: [
                {
                    name:'蒸发量',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name:'降水量',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name:'平均温度',
                    type:'line',
                    data:[32,42,40,52,15,35,20,35,35.11,20.40,50,40]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    




})