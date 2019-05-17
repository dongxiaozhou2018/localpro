$(function () {

    if(!getQueryString('webOp')){
        $('body').append('<iframe id="websocket" src="../websocket.html" style="display: none;"></iframe>');
    }
    function overView(searchTime){
        var url = global_path + '/getOverViewInfo';
        var parms = {
            "searchTime": searchTime
        }
        
        

        commonAjax(url,parms,function(res){
            if(res.code == 0){
                // 在线率
                // var onLineRateStr = res.data.onLineRateStr||res.data.avrOnlineRate;
                // var data = [
                //     {
                //         value: onLineRateStr.split('%')[0] - 0,
                //         name: '在线'
                //     },
                //     {
                //         value: (100 - onLineRateStr.split('%')[0]).toFixed(1),
                //         name: '掉线'
                //     }
                // ]

                // echarts_31(data,'fb1');

                // 故障处理自复率
                var data1 = [],data2 = [];
                var alarmRecordRepairMethods = res.data.alarmRecordRepairMethods;
                if(alarmRecordRepairMethods){
                    for(var i = 0;i<alarmRecordRepairMethods.length;i++){
                        if(alarmRecordRepairMethods[i].dealStatus == 1){

                            alarmRecordRepairMethods[i].dealStatus = '人工派单'

                        }else if(alarmRecordRepairMethods[i].dealStatus == 2){

                            alarmRecordRepairMethods[i].dealStatus = '远程修复'

                        }else if(alarmRecordRepairMethods[i].dealStatus == 3){

                            alarmRecordRepairMethods[i].dealStatus = '自动修复'
                        }
                        data1.push(alarmRecordRepairMethods[i].dealStatus);
                        var alarmRecordByGroupList = {

                            value: alarmRecordRepairMethods[i].count,
                            name: alarmRecordRepairMethods[i].dealStatus
                        };
                        data2.push(alarmRecordByGroupList);
                    }

                    echarts_32(data1,data2,'fb2','修复方式',"{a} <br/>{b}: {c} ({d}%)");
                }else{
                    data1 = ['人工派单','远程修复','自动修复'];
                    data2 = [{
                        value : 5,
                        name : '人工派单'
                    },{
                        value : 5,
                        name : '远程修复'
                    },{
                        value : 5,
                        name : '自动修复'
                    }]
                    echarts_32(data1,data2,'fb2','修复方式',"{a} <br/>{b}");
                }
                

                // 故障处理比率
                var data3 = [],data4 = [];
                var alarmRecordDealStatuses = res.data.alarmRecordDealStatuses;
                if(alarmRecordDealStatuses){
                    for(var i = 0;i<alarmRecordDealStatuses.length;i++){

                        if(alarmRecordDealStatuses[i].dealStatus != 3){
                            if(alarmRecordDealStatuses[i].dealStatus == 0){

                                alarmRecordDealStatuses[i].dealStatus = '待处理数量'

                            }else if(alarmRecordDealStatuses[i].dealStatus == 1){

                                alarmRecordDealStatuses[i].dealStatus = '处理中数量'

                            }else if(alarmRecordDealStatuses[i].dealStatus == 2){

                                alarmRecordDealStatuses[i].dealStatus = '已处理数量'
                            }
                            data3.push(alarmRecordDealStatuses[i].dealStatus);
                            var alarmRecord = {

                                value: alarmRecordDealStatuses[i].count,
                                name: alarmRecordDealStatuses[i].dealStatus
                            };
                            data4.push(alarmRecord);
                        }
                    }
                    echarts_32(data3,data4,'fb3','故障处理比率',"{a} <br/>{b}: {c} ({d}%)");
                }else{

                    data3 = ['待处理数量','处理中数量','已处理数量'];
                    data4 = [{
                        value : 5,
                        name : '待处理数量'
                    },{
                        value : 5,
                        name : '处理中数量'
                    },{
                        value : 5,
                        name : '已处理数量'
                    }]
                    echarts_32(data3,data4,'fb3','修复方式',"{a} <br/>{b}");
                }
                


                // 故障类型
                var data5 = [];
                if(res.data.alarmRecordByTypes){
                    for(var i = 0;i<res.data.alarmRecordByTypes.length;i++){

                        var alarmRecordByTypesData = {

                            value: res.data.alarmRecordByTypes[i].count,
                            name: res.data.alarmRecordByTypes[i].alarmName
                        };
                        data5.push(alarmRecordByTypesData);
                    }
                    echarts_33(data5,'fb4','故障类型',"{a} <br/>{b} : {c} ({d}%)");
                }else{
                    data5 = [{
                        value : 5,
                        name : '主干网络质量预警'
                    },{
                        value : 5,
                        name : '主干网络中断报警'
                    },{
                        value : 5,
                        name : '设备网络质量预警'
                    },{
                        value : 5,
                        name : '设备网络中断报警'
                    },{
                        value : 5,
                        name : 'ETH电流超限报警'
                    },{
                        value : 5,
                        name : 'DC12V电流超限报警'
                    },{
                        value : 5,
                        name : 'DC48V电流超限报警'
                    },{
                        value : 5,
                        name : '非授权开箱报警'
                    },{
                        value : 5,
                        name : '温度异常报警'
                    },{
                        value : 5,
                        name : '风扇故障报警'
                    },{
                        value : 5,
                        name : '短信发送失败报警'
                    },{
                        value : 5,
                        name : 'AC24V电流超限报警'
                    },{
                        value : 5,
                        name : 'AC220V电流超限报警'
                    },{
                        value : 5,
                        name : '接入供电故障报警'
                    }]
                    echarts_33(data5,'fb4','修复方式',"{a} <br/>{b}");
                }
                

                // 故障趋势
                var data6 = [],data7 = [];
                if(res.data.alarmRecordCountByTimes){

                    for(var i = 0;i<res.data.alarmRecordCountByTimes.length;i++){

                        res.data.alarmRecordCountByTimes[i].alarmTime = res.data.alarmRecordCountByTimes[i].alarmTime.split(' ')[0];

                        data6.push(res.data.alarmRecordCountByTimes[i].alarmTime);

                        var alarmRecordCountByTimesData = {

                            value: res.data.alarmRecordCountByTimes[i].count || 0,
                            name: res.data.alarmRecordCountByTimes[i].alarmName
                        };
                        data7.push(alarmRecordCountByTimesData);
                    }
                    echarts_1(data6,data7);
                }else{

                }
                


                // 故障区域分布
                var data8 = [],data9 = [],data10 = [];

                if(res.data.alarmRecordByGroups){
                    for(var i = 0;i<res.data.alarmRecordByGroups.length;i++){

                        if(data8.indexOf(res.data.alarmRecordByGroups[i].groupName) == -1){

                            data8.push(res.data.alarmRecordByGroups[i].groupName);
                        }

                        if(res.data.alarmRecordByGroups[i].dealStatus == 0){

                            data10.push(res.data.alarmRecordByGroups[i].count);

                        }else if(res.data.alarmRecordByGroups[i].dealStatus == 2){

                            data9.push(res.data.alarmRecordByGroups[i].count);
                        }
                    }
                    echarts_3(data8,data9,data10);
                }else{

                }
                


            }else if(res.code == -1){
                unauthorized(res.code);
            }else{
                alert(res.msg);
            }
        })
    }
    overView('30');

    $('.searchTime').on('change',function(){

        overView($('.searchTime').val());
    })







    
    
    echarts_6();
    echarts_4();

    function echarts_31(data,id) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
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

    function echarts_32(data1,data2,id,txt,formatter) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
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
                formatter: formatter,
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

    function echarts_33(data3,id,txt,formatter){
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
        option = {
            tooltip : {
                trigger: 'item',
                formatter: formatter,
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            series : [
                {
                    name:txt,
                    type:'pie',
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    radius: ['15%', '80%'],
                    center: ['50%', '55%'],
                    roseType : 'radius',
                    data:data3
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_1(data4,data5) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart1'));
        myChart.clear();
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
            grid: {
                left: '5%',
                top: '5%',
                right: '2%',
                bottom: '20%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: data4,
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
                    show: true,
                    rotate:45,
                    splitNumber: 15,
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: '12',
                    },
                },

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
                end: 100
            }, {
                start: 0,
                end: 100,
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
                    data: data5

                }]

        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    // function echarts_2() {
    //     // 基于准备好的dom，初始化echarts实例
    //     var myChart = echarts.init(document.getElementById('fb5'));
    //     myChart.clear();
    //     option = {
    //         title: [{
    //             text: '能耗统计',
    //             left: 'center',
    //             textStyle: {
    //                 color: '#fff',
    //                 fontSize: '16'
    //             }

    //         }],
    //         angleAxis: {
    //             axisLine: {
    //                 show: true,
    //                 lineStyle: {
    //                     color: "rgba(255,255,255,.1)",
    //                     width: 1,
    //                     type: "solid"
    //                 },
    //             },
    //             axisLabel: {
    //                 interval: 0,
    //                 // rotate:50,
    //                 show: true,
    //                 splitNumber: 15,
    //                 textStyle: {
    //                     color: "rgba(255,255,255,.6)",
    //                     fontSize: '12',
    //                 },
    //             },
    //         },
    //         radiusAxis: {
    //             type: 'category',
    //             data: ['周一', '周二', '周三', '周四'],
    //             axisLine: {
    //                 show: true,
    //                 lineStyle: {
    //                     color: "rgba(255,255,255,.1)",
    //                     width: 1,
    //                     type: "solid"
    //                 },
    //             },
    //             axisLabel: {
    //                 interval: 0,
    //                 // rotate:50,
    //                 show: true,
    //                 splitNumber: 15,
    //                 textStyle: {
    //                     color: "rgba(255,255,255,.6)",
    //                     fontSize: '12',
    //                 },
    //             },
    //             z: 10
    //         },
    //         polar: {
    //             center: ['50%', '57%'],
    //         },
    //         series: [{
    //             type: 'bar',
    //             data: [1, 2, 3, 4],
    //             coordinateSystem: 'polar',
    //             name: 'A',
    //             stack: 'a',
    //             itemStyle:{
    //                 color:'#065aab'
    //             }
    //         }, {
    //             type: 'bar',
    //             data: [2, 4, 6, 8],
    //             coordinateSystem: 'polar',
    //             name: 'B',
    //             stack: 'a',
    //             color: '#0682ab'
    //         }, {
    //             type: 'bar',
    //             data: [1, 2, 3, 4],
    //             coordinateSystem: 'polar',
    //             name: 'C',
    //             stack: 'a',
    //             color: '#06b4ab'
    //         }]
    //     };

    //     // 使用刚指定的配置项和数据显示图表。
    //     myChart.setOption(option);
    //     window.addEventListener("resize", function () {
    //         myChart.resize();
    //     });
    // }

    function echarts_6() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb5'));
        myChart.clear();
        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                borderWidth:3,
                borderColor:'#0e1d56'
            }
        };
        var placeHolderStyle = {
            normal: {
                color: 'rgba(255,255,255,.05)',
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        option = {
            title: [{
                text: '能耗统计',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
            tooltip: {
                show: true,
                formatter: "{a} : {c} "
            },
            legend: {
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 12,
                bottom: '3%',

                data: ['浙江', '上海', '广东', '北京'],
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
            },

            series: [
                {
                    name: '浙江',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '50%'],
                    radius: ['59%', '70%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: 60,
                        name: '01'
                    }, {
                        value: 40,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '上海',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '50%'],
                    radius: ['50%', '60%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: 60,
                        name: '02'
                    }, {
                        value: 40,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '广东',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '50%'],
                    radius: ['39%', '50%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 60,
                        name: '03'
                    }, {
                        value: 40,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '北京',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '50%'],
                    radius: ['29%', '40%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 60,
                        name: '04'
                    }, {
                        value: 40,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                }
                ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echarts_3(data8,data9,data10) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb6'));
        myChart.clear();
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
                data: data8,
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
                    rotate:45,
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
                    name: '已处理',
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
                    data: data9,
                },
                {
                    name: '未处理',
                    type: 'bar',
                    stack: '总量',
                    barWidth: '35%', //柱子宽度
                    itemStyle: {
                        normal: {
                            color: '#065aab',
                            opacity: 1,
                        }
                    },
                    data: data10
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
        myChart.clear();
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
                // {
                //     name:'降水量',
                //     type:'bar',
                //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                // },
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