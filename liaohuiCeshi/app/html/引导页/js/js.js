
/**
 * Created by liaohui1080 on 16/6/2.
 */

guanxi();
leida()

function leida() {

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('leida'));
    // 过渡---------------------
    myChart.showLoading({
        text: '正在努力的读取数据中...',    //loading话术
    });
    myChart.hideLoading();
    // myChart.grid(20,20,0,0)
    window.onresize = myChart.resize;
   var  option = {


        visualMap: {
            color: ['red', 'yellow'],
            show:false
        },
       tooltip: {
           trigger: 'item',
           backgroundColor : 'rgba(0,0,250,0.2)'
       },
        radar: {
            indicator : [
                { text: '1', max: 400},
                { text: '2', max: 400},
                { text: '3', max: 400},
                { text: '4', max: 400},
                { text: '5', max: 400},
                { text: '6', max: 400},
                { text: '7', max: 400},
                { text: '8', max: 400},
                { text: '9', max: 400},
                { text: '10', max: 400}
            ],
            name: {
                textStyle: {
                    color: '#ffdb92'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ffdb92'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ffdb92'
                }
            },
        },


       series : (function (){
            var series = [];
            for (var i = 1; i <= 28; i++) {
                series.push({
                    name:'浏览器（数据纯属虚构）',
                    type: 'radar',

                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width:1,
                            }
                        },
                        emphasis : {
                            areaStyle: {color:'rgba(0,250,0,0.3)'}
                        }
                    },
                    data:[
                        {
                            value:[
                                (40 - i) * 10,
                                (38 - i) * 4 + 60,
                                i * 5 + 10,

                                i * 9,
                                i * 9,
                                i * 9,
                                i * 9,
                                i * i /2
                            ],
                            name:i + 2000
                        }
                    ]
                });
            }
            return series;
        })()
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}




function guanxi() {
    var dom = document.getElementById("guanxi");
    var myChart = echarts.init(dom);
    var app = {};
    var option = null;
    var base = +new Date(2016, 5, 3);
    var oneDay = 24 * 3600 * 1000;
    var date = [];

    // 过渡---------------------
    myChart.showLoading({
        text: '正在努力的读取数据中...',    //loading话术
    });
    myChart.hideLoading();
    // myChart.grid(20,20,0,0)
    window.onresize = myChart.resize;



    var data = [Math.random() * 150];
    var now = new Date(base);

    function addData(shift) {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
        date.push(now);
        data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);
        if (shift) {
            date.shift();
            data.shift();
        }
        now = new Date(Date.parse(now) + 24 * 3600 * 1000);
    }

    for (var i = 1; i < 100; i++) {
        addData();
    }

    option = {

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            boundaryGap: [0, '50%'],
            type: 'value'
        },

        series: [
            {
                name:'成交',
                type:'line',
                smooth:true,
                symbol: 'none',
                stack: 'a',
                areaStyle: {
                    normal: {}
                },
                data: data
            }
        ]
    };

    app.timeTicket = setInterval(function () {
        addData(true);
        myChart.setOption({
            xAxis: {
                // data: date
            },
            series: [{
                name:'成交',
                data: data
            }]
        });
    }, 500);;

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

