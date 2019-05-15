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
                        name: '不在线'
                    }
                ]

                echarts_31(data);

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
                echarts_32(data1,data2);

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
                echarts_2(data5,data6);


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
                console.log(data7)
                echarts_4(data7,data8);

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
    overView(times);









    
    
    echarts_5();
    echarts_6();

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
                }
            },
            legend: {
                top: '0%',
                data: ['2019故障'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            grid: {
                left: '10',
                top: '30',
                right: '10',
                bottom: '10',
                containLabel: true
            },

            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    }

                },

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
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
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

    function echarts_2(data5,data6) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart2'));

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0%',
                top: '10px',
                right: '0%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: data5,
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

                    type: 'bar',
                    data: data6,
                    barWidth: '35%', //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle: {
                        normal: {
                            color: '#27d08a',
                            opacity: 1,
                            barBorderRadius: 5,
                        }
                    }
                }

            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_5() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart5'));

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },
            grid: {
                left: '10',
                top: '30',
                right: '10',
                bottom: '10',
                containLabel: true
            },

            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    }

                },

                data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12']

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
            series: [
                {
                    name: '耗电',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {

                        normal: {
                            color: '#09c',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#09c',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: [3, 4, 3, 4, 3, 4, 3, 6, 3, 4, 3, 6]

            }]

        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_4(data7,data8) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart4'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: data7,
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [

                {
                    name: '故障自复率',
                    type: 'pie',
                    center: ['50%', '60%'],
                    radius: '55%',
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: data8,
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart6'));

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },
            grid: {
                left: '10',
                top: '30',
                right: '10',
                bottom: '10',
                containLabel: true
            },

            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 12,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.2)'
                    }

                },

                data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12']

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
            series: [
                {
                    name: '安全情况',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {

                        normal: {
                            color: '#00d887',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 135, 0.4)'
                }, {
                                offset: 0.8,
                                color: 'rgba(0, 216, 135, 0.1)'
                }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#00d887',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: [3, 4, 3, 4, 3, 4, 3, 6, 3, 4, 3, 6]

            }]

        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_31(data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb1'));
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
                data: ['在线', '不在线'],
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

    function echarts_32(data1,data2) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb2'));
        option = {

            title: [{
                text: '故障类型',
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
                    name: '故障类型',
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




})