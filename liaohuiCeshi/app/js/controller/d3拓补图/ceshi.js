var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {



    //网络拓补图
    topology()


    //加载摄像头
    camera()

    //加载实时监控 图表
    loadeChart()

    neighborHazard();

    // 定时获取数据
    var timer = function () {

        $scope.topologyClick();
        $scope.videoClick();

        //加载实时监控 图表
        $scope.clickLoadeChart()

        $scope.neighborHazardClick();

    };
    setInterval(timer, 30000);


    //刷新拓补图事件
    $scope.topologyClick = function () {


        topology()
    };


    //刷新摄像头事件
    $scope.videoClick = function () {

        camera()
    };

    //刷新实时监控 图表 事件
    $scope.clickLoadeChart = function () {
        //加载实时监控 图表
        loadeChart()
    };

    //刷新相邻重大危险源事件
    $scope.neighborHazardClick=function () {
        neighborHazard()
    }
    

    //加载实时监控图表
    function loadeChart() {
        lh_ajax.get({
            url: "server_json/chart_data.json",
            success: function (msg) {

                quxiantu(msg.data)
            }
        })
    }


    //加载拓补图
    function topology() {
        lh_ajax.get({
            url: "server_json/5.json",
            success: function (msg) {
                //清空svg
                d3.select(".tuxing").html("");
                force(msg.data)
                dianbo(); //调用电波图
            }
        })
    }

    //加载摄像头图
    function camera() {
        lh_ajax.get({
            url: "server_json/6.json",
            success: function (msg) {
                //清空svg
                d3.select(".shexiangtou").html("");
                //摄像头
                shexiangtou(msg.data);
            }
        })
    }



    //相邻重大危险源
    function neighborHazard() {
        lh_ajax.get({
            url: "server_json/重大危险源.json",
            success: function (msg) {
                console.log(msg.data)
                $scope.neighborHazardItem=msg.data;
            }
        })
    }

}]);




//分子图
function force(data) {


    var width = $(".tuxingWidth").width(),
        height = 600,
        root=data;

    var force = d3.layout.force()
        .linkDistance(100) //连接线距离
        // .linkStrength(0.2) // 连接线坚固度
        .friction(0.9) //摩擦系数
        .charge(-600)  //节点的电荷数, 节点与节点点的间距
        // .gravity(0.4)  //引力强度, 回导致 图形不能出现在正中央
        .alpha(1)
        .size([width, height])
        .on("tick", tick)

        ;

    var svg = d3.select(".tuxing").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bg");


    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");


    // d3.json("server_json/5.json", function (error, json) {
    //     if (error) throw error;
    //
    //     // if(json.status) root=json.data
    //     root = json.status?json.data:alert("数据格式错误");
    //     // console.log(json)
    //
    //     update();
    // });
    //

    //执行创建节点方法
    update();


    function update() {


        var nodes = flatten(root),
            links = d3.layout.tree()
                .links(nodes);

        // Restart the force layout.
        force.nodes(nodes)
            .links(links)

            .start();

        // Update links.
        link = link.data(links, function (d) {
            return d.target.id;
        });
        //
        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        // Update nodes.
        node = node.data(nodes, function (d) {
            return d.id;
        });

        node.exit().remove();


        //插入节点组
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);


        //添加一个提示框
        var tooltip = d3.select(".tooltip")

        //插入圆形
        nodeEnter.append("circle")
            .attr("r", function (d) {
                // console.log(d.size)

                if (d.size) {
                    return 60;
                } else {
                    return 14;
                }

            })
            .on("mouseover", function (d) {
                /*
                 鼠标移入时，
                 （1）通过 selection.html() 来更改提示框的文字
                 （2）通过更改样式 left 和 top 来设定提示框的位置
                 （3）设定提示框的透明度为1.0（完全不透明）
                 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);

            }).on("mousemove", function (d) {
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);
            })
            .on("mouseout", function (d) {
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/

                tooltip.style("opacity", 0.0);
            });


        //给圆添加颜色
        node.select("circle")
            .attr("class", color);


        nodeEnter.append("image")
            .attr("opacity", 0.6)
            .attr("width", 16)
            .attr("height", 16)

            .attr("xlink:href", function (d) {
                if (d.size) {
                    // return "../../images/server/2.png";
                } else {
                    return "../../images/server/1.png";
                }
            })
            .attr("transform", "translate(-8,-8)")
            .on("mouseover", function (d) {
                /*
                 鼠标移入时，
                 （1）通过 selection.html() 来更改提示框的文字
                 （2）通过更改样式 left 和 top 来设定提示框的位置
                 （3）设定提示框的透明度为1.0（完全不透明）
                 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);

            }).on("mousemove", function (d) {
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);
            })
            .on("mouseout", function (d) {
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/

                tooltip.style("opacity", 0.0);
            });

        //寻找主节点, 使用 filter 过滤所有的节点, 知道找到最后一个节点, 使用i来选择对于的节点
        var rootNode = node.filter(function (d, i) {
            if (i == (node.size() - 1)) { //如果i== 最后一个节点 (node.size 获取节点数)
                return i; //返回选中的节点
            }
        });


        //创建一个圆环

        var rootNodeR = 60;
        rootNode.append("circle")
            .attr("class", "root-node-1")
            .attr("fill", "#142d3b")
            .attr("stroke-width", 2)
            .attr("stroke", "#0096FC")
            .attr("r", rootNodeR)


        //远点圆环 半径
        var rootNodeYuandianR = rootNodeR - 15;
        rootNode.append("circle")
            .attr("class", "root-node-2")
            .attr("fill", "#142d3b")
            .attr("stroke-width", 3)
            .attr("stroke", "#204A75")
            .attr("r", rootNodeYuandianR)


        rootNode.append("circle")

            .attr("class", "root-node-3")
            .attr("fill", "#142d3b")
            .attr("stroke-width", 3)
            .attr("stroke", "#0096FC")
            .attr("stroke-dasharray", "3,8")
            .attr("r", rootNodeYuandianR + 1);

        //橘色圆环
        rootNode.append("circle")
            .attr("class", "root-node-4")
            .attr("fill", "#142d3b")
            .attr("stroke-width", 3)
            .attr("stroke", "#FBB03B")
            .attr("stroke-dasharray", "3,6")
            // .attr("r",1)
            .attr("transform", "rotate(0)")
            .attr("transform", "rotate(999)")
            .attr("r", rootNodeYuandianR - 15);

        rootNode.append("circle")
            .attr("class", "root-node-5")
            .attr("fill", "#0F2036")
            .attr("stroke-width", 4)
            .attr("stroke", "#204A75")
            .attr("r", rootNodeYuandianR - 15 - 15);
        rootNode.append("circle")
            .attr("class", "root-node-6")
            .attr("fill", "#2D5A9C")
            .attr("stroke-width", 4)
            .attr("stroke", "#204A75")
            .attr("r", rootNodeYuandianR - 15 - 15 - 8);

        rootNode.append("image")
            .attr("class", "root-node-7")
            .attr("width", 55)
            .attr("height", 35)
            .attr("xlink:href", "../../images/server/zhen.png")
            .attr("transform", function (d, i) {
                return "translate(0,0)"
            });


    }

    function tick() {
        // console.log("tick")
        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        //
        // link.attr("x1", function (d) {
        //         return width/2;
        //     })
        //     .attr("y1", function (d) {
        //         return height/2;
        //     })
        //     .attr("x2", function (d) {
        //         return d.target.x;
        //     })
        //     .attr("y2", function (d) {
        //         return d.target.y;
        //     });


        // node.attr("x1", function (d) {
        //         return width/2;
        //     })
        //     .attr("y1", function (d) {
        //         return height/2;
        //     })
        //     .attr("x2", function (d) {
        //         return d.target.x;
        //     })
        //     .attr("y2", function (d) {
        //         return d.target.y;
        //     });

        // node.attr("transform", function (d) {
        //     // return "translate(" + d.x + "," + d.y + ")";
        //     return "translate(" + d.x + "," + d.y + ")";
        // });

        node.attr("transform", function (d) {
            // console.log(d.x+"+++++++++++"+d.y)
            // console.log(d.x+(width/2) +"----"+d.y+(height/2))

            // if(d.y>height){
            //     return "translate(" + d.x + "," + height+ ")";
            // }else{
            //     return "translate(" + d.x + "," + d.y + ")";
            // }
            // $(".abc").css({top:d.y+70 , left:d.x-30})

            return "translate(" + d.x + "," + d.y + ")";
            // return "translate(" + (width)/2 + "," + (height)/2  + ")";
        });


        // node.attr("x", function (d) {
        //         return d.x;
        //     })
        //     .attr("y", function (d) {
        //         return d.y;
        //     });

    }

    function color(d) {
        // console.log(d)

        //如果有下级数据, 则显示这里
        if (d.children) {

            //如果状态存在,则说明服务不通 显示low
            if (d.status) {
                return "yuan-status-low";


            } else { //状态不存在,则说明服务器通着,

                //如果size存在说明 是主节点, 显示主节点颜色
                if (d.size) {
                    return "yuan-root";

                } else { //显示一般节点颜色
                    return "yuan";
                }
            }


        } else { //没有下级数据

            if (d.status) {
                return "yuan-status-low";
            } else {
                return "yuan-children";
            }


        }

        // return d._children ? "yuan" // collapsed package
        //     : d.children ? "yuan" // expanded package
        //     : "yuan"; // leaf node

        // return d._children ? "#fff" // collapsed package
        //     : d.children ? "#fff" // expanded package
        //     : "#fff"; // leaf node
    }

// Toggle children on click.
    function click(d) {
        // console.log("click");
        if (d3.event.defaultPrevented) return; // ignore drag
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update();
    }


    // //显示提示信息
    // function infoShow(d) {
    //     console.log(d)
    //     console.log("显示提示信息");
    //     node.append("text")
    // }

// Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }

    return {"update": update}
}


//摄像头
function shexiangtou(data) {
    var width = $(".shexiangtou").width(),
        height = 600,
        svg_nodes,
        svg_texts,
        nodes = data, //加载数据
        force,
        root;

    // var force = d3.layout.force()
    //     .linkDistance(80)
    //     .charge(-200)
    //     .gravity(0)
    //     .size([width, height]);

    var svg = d3.select(".shexiangtou").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bg")
        ;

    // var link = svg.selectAll(".link"),
    //     svg_nodes = svg.selectAll(".node");

    update()

   function update(error, root) {

        // console.log(nodes);
       //加载力学图布局
        force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .charge(-100)
            .start();


        //添加一个提示框
        var tooltip = d3.select(".tooltip")


        svg_nodes = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("class", function (d) {
                return d.status ? "shexiangtou-status-low" : "shexiangtou";
            }).on("mouseover", function (d) {
                /*
                 鼠标移入时，
                 （1）通过 selection.html() 来更改提示框的文字
                 （2）通过更改样式 left 和 top 来设定提示框的位置
                 （3）设定提示框的透明度为1.0（完全不透明）
                 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);

            }).on("mousemove", function (d) {
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);
            })
            .on("mouseout", function (d) {
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/

                tooltip.style("opacity", 0.0);
            })
            .call(force.drag);	//使得节点能够拖动

        //添加描述节点的文字
        // svg_texts = svg.selectAll("text")
        //     .data(nodes)
        //     .enter()
        //     .append("text")
        //     .style("fill", "black")
        //     .attr("width", 70)
        //     .attr("text-anchor", "middle") //文字居中对齐
        //     .attr("dx", 0)
        //     .attr("dy", 35)
        //     .call(force.drag)	//使得节点能够拖动
        //     .text(function (d) {
        //         // return [d.name];
        //     })
        //     .on("mouseover", function (d) {
        //
        //         if (d.info) {
        //             d3.select(".info").html([d.info])
        //         }
        //
        //     })
        //     .on("mouseout", function (d) {
        //         d3.select(".info").html(['<i class="fa fa-info-circle"></i> 提示信息'])
        //
        //     });

        var svg_shexiangtou = svg.selectAll("image")
            .data(nodes)
            .enter()
            .append("image")
            .style("fill", "black")
            .attr("width", 16)
            .attr("height", 19)
            .attr("transform", function (d) {
                return "translate(-7,-8)";
            })


            .attr("xlink:href", "../../images/server/shexiangtou.png")
            .on("mouseover", function (d) {
                /*
                 鼠标移入时，
                 （1）通过 selection.html() 来更改提示框的文字
                 （2）通过更改样式 left 和 top 来设定提示框的位置
                 （3）设定提示框的透明度为1.0（完全不透明）
                 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0)
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);

            }).on("mousemove", function (d) {
                /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
                tooltip.select('.tooltip-title').html(d.name)
                tooltip.select('.tooltip-body').html(d.info);
            })
            .on("mouseout", function (d) {
                /* 鼠标移出时，将透明度设定为0.0（完全透明）*/

                tooltip.style("opacity", 0.0);
            })
            .call(force.drag);	//使得节点能够拖动

        svg_nodes.select("circle")


        // var svg_shexiangtou = svg.selectAll("text")
        //    .data(nodes)
        //    .enter()
        //    .append("html")
        //    .style("fill", "black")
        //    .attr("dx", 20)
        //    .attr("dy", 8)
        //    .html(function(d){
        //        return ['<i class="iconfont">&#xe60c;</i>'];
        //    });

        force.on("tick", function () {	//对于每一个时间间隔

            //更新连线坐标
            // svg_edges.attr("x1",function(d){ return d.source.x; })
            //     .attr("y1",function(d){ return d.source.y; })
            //     .attr("x2",function(d){ return d.target.x; })
            //     .attr("y2",function(d){ return d.target.y; });

            //更新节点坐标
            svg_nodes.attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });


            //更新文字坐标
            // svg_texts.attr("x", function (d) {
            //         return d.x;
            //     })
            //     .attr("y", function (d) {
            //         return d.y;
            //     });

            //更新摄像头坐标
            svg_shexiangtou.attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                });
        });
    };


}


//电波
function dianbo() {
    var n = 500,
        random = d3.random.normal(0, 0.1),
        data = d3.range(n).map(random);


    var width = $(".tuxingWidth2").width(),
        height = 80;

    var x = d3.scale.linear()
        .domain([0, n - 1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([1, -1])
        .range([0, height]);

    var line = d3.svg.line()
        .x(function (d, i) {
            return x(i);
        })
        .y(function (d, i) {
            return y(d);
        });

    var svg = d3.select(".dianbo").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        .attr("transform", "translate(0,0)");


    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + y(0) + ")")
    //     .call(d3.svg.axis().scale(x).orient("bottom"));
    var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    tick();

    function tick() {

        // push a new data point onto the back
        data.push(random());

        // pop the old data point off the front
        data.shift();

        // redraw the line (with the wrong interpolation)
        path.transition()
            .duration(1000)
            .ease("linear")
            .attr("d", line)
            .each("end", tick);

    }


}

//曲线图
function quxiantu(o) {
    var myChart = echarts.init(document.getElementById('main'));
    // 过渡---------------------
    myChart.showLoading({
        text: '正在努力的读取数据中...',    //loading话术
    });
    myChart.hideLoading();
    // myChart.grid(20,20,0,0)
    window.onresize = myChart.resize;

    var option2 = {
        // 全图默认背景
        // backgroundColor: '#1b1b1b',

        // 默认色板
        // color: [
        //     '#FE8463', '#9BCA63', '#FAD860', '#60C0DD', '#0084C6',
        //     '#D7504B', '#C6E579', '#26C0C0', '#F0805A', '#F4E001',
        //     '#B5C334'
        // ],
        //边距网格
        grid: {
            x: 60,
            y: 50,
            x2: 30,
            y2: 40
        },

        // 图表标题
        // title: {
        //     text: "实时监测",
        //     textStyle: {
        //         fontWeight: 'normal',
        //         color: '#3a87ad' ,         // 图例文字颜色
        //         fontSize:18,
        //     },
        //     x:"left",
        //     y:"top",
        // },

        // 图例
        legend: {
            textStyle: {
                color: '#3a87ad',         // 图例文字颜色
                fontSize: 13,
            },
            data: ['意向', '预购', '成交'],
            x: "left",
            y: "top",
        },


        //工具条
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            },
            x: "right",
            y: "top",
        },


        // 提示框
        tooltip: {
            backgroundColor: 'rgba(250,250,250,0.8)',     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {          // 直线指示器样式设置
                    color: '#aaa'
                },
                crossStyle: {
                    color: '#aaa'
                },
                shadowStyle: {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            },
            textStyle: {
                color: '#333'
            }
        },


        xAxis: [
            {

                splitLine: {
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#173452'
                    }
                },
                //设置坐标轴文字颜色
                axisLabel: {
                    textStyle: {color: "#0096FC"}
                },
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value',
                //设置坐标轴边框颜色
                splitLine: {
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#173452'
                    }
                },
                //设置坐标轴文字颜色
                axisLabel: {
                    textStyle: {color: "#0096FC"}
                }
            }
        ],
        series: [
            {
                name: '成交',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {color: "#FFFF00", areaStyle: {color: '#FFFF00'}}},
                data: [10, 12, 21, 54, 260, 830, 0]
            },
            {
                name: '预购',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {color: "#8B2BCC", areaStyle: {color: '#8B2BCC'}}},
                data: [0, 182, 434, 791, 390, 30, 10, 40, 900, 100, 300, 200, 500]
            },
            {
                name: '意向',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {color: "#00D7FB", areaStyle: {color: '#00D7FB'}}},
                data: [1000, 800, 601, 234, 120, 90, 20]
            }
        ]
    };
    var option = {
        // 全图默认背景
        // backgroundColor: '#1b1b1b',

        // 默认色板
        // color: [
        //     '#FE8463', '#9BCA63', '#FAD860', '#60C0DD', '#0084C6',
        //     '#D7504B', '#C6E579', '#26C0C0', '#F0805A', '#F4E001',
        //     '#B5C334'
        // ],
        //边距网格
        grid: {
            x: 60,
            y: 50,
            x2: 30,
            y2: 40
        },

        // 图表标题
        // title: {
        //     text: "实时监测",
        //     textStyle: {
        //         fontWeight: 'normal',
        //         color: '#3a87ad' ,         // 图例文字颜色
        //         fontSize:18,
        //     },
        //     x:"left",
        //     y:"top",
        // },

        // 图例
        legend: {

            textStyle: {
                color: '#3a87ad',         // 图例文字颜色
                fontSize: 13,
            },
            data: ['意向', '预购', '成交'],
            x: "left",
            y: "top",
        },


        //工具条
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                // restore: {show: true},
                // saveAsImage: {show: true},
                myTool1: {
                    show: true,
                    title: '刷新',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        alert('myToolHandler1')
                    }
                },
            },
            x: "right",
            y: "top",
        },


        // 提示框
        tooltip: {
            backgroundColor: 'rgba(250,250,250,0.8)',     // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {          // 直线指示器样式设置
                    color: '#aaa'
                },
                crossStyle: {
                    color: '#aaa'
                },
                shadowStyle: {                     // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            },
            textStyle: {
                color: '#333'
            }
        },


        xAxis: [
            {

                splitLine: {
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#173452'
                    }
                },
                //设置坐标轴文字颜色
                axisLabel: {
                    textStyle: {color: "#0096FC"}
                },
                type: 'category',
                boundaryGap: false,
                data: o.xAxis,

            }
        ],
        yAxis: [
            {
                type: 'value',
                //设置坐标轴边框颜色
                splitLine: {
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#173452'
                    }
                },
                //设置坐标轴文字颜色
                axisLabel: {
                    textStyle: {color: "#0096FC"}
                }
            }
        ],
        // series: [
        //     {
        //         name: '成交',
        //         type: 'line',
        //         smooth: true,
        //         itemStyle: {normal: {color: "#FFFF00", areaStyle: {color: '#FFFF00'}}},
        //         data: [10, 12, 21, 54, 260, 830, 0]
        //     },
        //     {
        //         name: '预购',
        //         type: 'line',
        //         smooth: true,
        //         itemStyle: {normal: {color: "#8B2BCC", areaStyle: {color: '#8B2BCC'}}},
        //         data: [0, 182, 434, 791, 390, 30, 10, 40, 900, 100, 300, 200, 500]
        //     },
        //     {
        //         name: '意向',
        //         type: 'line',
        //         smooth: true,
        //         itemStyle: {normal: {color: "#00D7FB", areaStyle: {color: '#00D7FB'}}},
        //         data: [1000, 800, 601, 234, 120, 90, 20]
        //     }
        // ]

        series: []
    };


    //把数据添加到option里面
    for (var s = 0; s < o.series.length; s++) {

        //给节点增加数据,显示线性图
        o.series[s].type = 'line';
        o.series[s].itemStyle = {normal: {color: o.series[s].colorBg, areaStyle: {color: o.series[s].colorBg}}}; //设置图背景
        o.series[s].smooth = true; //线的转折点转换为圆角
        option.series.push(o.series[s]); //把数据添加到节点上


        //给图例添加数据
        option.legend.data.push(o.series[s].name)

    }


    myChart.setOption(option);
}

