var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html
    "ui.select", // 下拉菜单

]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务
myApp.filter("timeFormat", lhFilter.timeFormat); //时间格式化
//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {


    liuchengtu()


    //流程图
    function liuchengtu() {


        //颜色
        var redColor = "#E94B65", //红色
            huiseColor = "#B3B3B3",
            greeColor = "#00989C"; //绿色
            blueColor = "#2E97DE"; //绿色

        var procedureWidth = $(".procedure").width(); //页面的宽度
        var svgWidth = 3000; //svg图形默认宽度
        var svgHeight = 300; //svg 默认高度
        var svgZhongjian = 567; //svg中间流程部分的宽度

        //确定svg图形的最小宽度是 1000.如果页面宽度低于1000 则按照1000
        if (procedureWidth < 1000) {
            procedureWidth = 1000;
        } else {
            procedureWidth = $(".procedure").width();
        }


        var pianyiWidth = (procedureWidth - svgZhongjian) / 2; //向左向右偏移的宽度


        var leftMargin = (svgWidth - procedureWidth) / 2;// 获取svg图形 向左的起始位置坐标

        //计算百分比
        function baifenbi(d, a) {
            return (a * d) / 100;
        }


        //选择svg
        var svg = Snap("#procedureSvg")
        svg.attr({
            height: svgHeight,
            viewBox: leftMargin + " 0 " + procedureWidth + " " + svgHeight
        });


        //计算各个节点偏移的距离

        //计划
        $("#jihua").css({left: baifenbi(0, pianyiWidth), top: 60, height: 148, width: 134});
        //隐患
        $("#yinhuan").css({left: baifenbi(33, pianyiWidth), top: 50, height: 180, width: 142});
        //整改
        $("#zhenggai").css({left: pianyiWidth - 75, top: 20, height: 180, width: 100});
        //完成
        $("#wancheng").css({left: baifenbi(85, procedureWidth), top: 98, height: 93});

        ////计划提示框
        //$("#jihua .jiedian , .popover-jihua").hover(
        //    function () {
        //        $(".popover-jihua").css({left: baifenbi(0, pianyiWidth) + 9, top: 130}).show()
        //    }, function () {
        //        $(".popover-jihua").hide()
        //    }
        //)
        //
        //
        ////隐患提示框
        //$("#yinhuan .jiedian , .popover-yinhuan").hover(
        //    function () {
        //        $(".popover-yinhuan").css({left: baifenbi(33, pianyiWidth) - 3, top: 130}).show()
        //    }, function () {
        //        $(".popover-yinhuan").hide()
        //    }
        //)


        //基线
        var j2 = "M0,122.944l1227.043-0.033   c2.732,0,4.959,2.193,5,4.926l0.196,13.149c0.041,2.732,2.267,4.926,5,4.926h90.731c2.761,0,5-2.239,5-5l0-13c0-2.761,2.239-5,5-5   h292.713c3.308,0,6.402-1.636,8.264-4.369l57.072-84.256c1.859-2.745,5.592-3.462,8.335-1.601l0.729,0.494   c2.738,1.857,3.456,5.579,1.607,8.321l-109.296,162.021c-1.85,2.742-1.131,6.465,1.607,8.321l7.907,5.362   c2.729,1.851,6.44,1.152,8.31-1.564l61.109-88.787c1.869-2.715,4.954-4.335,8.25-4.33L3000,122.911"
        var jixianPath = svg.select("#jixian").attr({
            d: j2
        });

        //红线
        var hongxianPathD = "M1204.996,122.911h22.047   c2.732,0,4.959,2.193,5,4.926l0.196,13.149c0.041,2.732,2.267,4.926,5,4.926h90.731c2.761,0,5-2.239,5-5l0-13c0-2.761,2.239-5,5-5   h292.713c3.308,0,6.402-1.636,8.264-4.369l58.755-86.742c0.93-1.372,2.796-1.731,4.168-0.8l5.69,3.859   c1.369,0.928,1.728,2.789,0.803,4.161l-110.97,164.502c-1.85,2.742-1.131,6.465,1.607,8.321l7.907,5.362   c2.729,1.851,6.44,1.152,8.31-1.564l7.216-10.784l-7.216,10.784l61.109-88.787c1.869-2.715,4.954-4.335,8.25-4.33L3000,122.911"
        var hongxianPath = svg.select("#hongxian").attr({
            d: hongxianPathD
        });
        //var hongxian2Path = svg.select("#hongxian2").attr({
        //    d: hongxianPathD
        //});

        //蓝线
        var lanxianPathD = "M1615.215,215.64l61.109-88.787 c1.869-2.715,4.954-4.335,8.25-4.33l99.053,0.389";
        var lanxianPath = svg.select("#lanxian").attr({
            d: lanxianPathD
        });

        //一次整改
        var huixian1D = "M1315.31,146.75l-0.1-24.882   c-0.013-3.323,2.677-6.024,6-6.024h306.07c3.323,0,6.429-1.651,8.288-4.405l58.747-87.02c1.857-2.75,5.594-3.471,8.34-1.609   l11.757,7.973c2.739,1.857,3.457,5.582,1.604,8.325l-102.794,152.269c-2.314,3.428-1.996,6.499,1.605,8.323l7.603,5.156";
        var huixian1Path = svg.select("#huixian1").attr({
            d: huixian1D
        });

        //二次整改
        var huixian2D = "M1283.31,146.75v-30.125   c0-3.314,2.686-6,6-6h335.432c3.323,0,6.429-1.651,8.288-4.405l59.976-88.84c1.857-2.75,5.594-3.471,8.34-1.609l20.167,13.675   c2.739,1.857,3.457,5.581,1.605,8.323l-86.338,127.889c-0.926,1.371-0.567,3.233,0.803,4.162l5.83,3.954"
        var huixian2Path = svg.select("#huixian2").attr({
            d: huixian2D
        });

        //三次整改
        var huixian3D = "M1249.31,144.75v-33.375   c0-3.314,2.686-6,6-6h366.78c3.323,0,6.429-1.651,8.288-4.405l61.303-90.806c1.857-2.75,5.594-3.471,8.34-1.609l28.574,19.377   c2.739,1.857,3.457,5.581,1.605,8.323l-70.756,104.809l4.174,2.781"
        var huixian3Path = svg.select("#huixian3").attr({
            d: huixian3D
        });


        //整改选中状态
        function zhenggaiXuanzhong(id, color) {
            var huixianGroup = svg.select(id);
            huixianGroup.selectAll(".line-huixian")
                .animate({
                    stroke: color,
                    strokeDasharray: 0
                }, 1000, mina.bounce);


            huixianGroup.selectAll(".dian")
                .animate({
                    stroke: color,
                    fill: "#fff"
                }, 500, mina.bounce);
            huixianGroup.selectAll(".xian")
                .animate({
                    stroke: color,
                    strokeDasharray: 0
                }, 500, mina.bounce);
            huixianGroup.selectAll(".wenzi")
                .animate({
                    fill: color
                }, 500, mina.bounce);
            huixianGroup.selectAll(".yuan")
                .animate({
                    fill: color
                }, 500, mina.bounce);

            //修改红线的颜色
            svg.select("#hongxian")
                .attr({stroke: color});
        }


        //整改默认状态
        function zhenggaiDefault(id) {

            var huixianGroup = svg.select(id);

            huixianGroup.selectAll(".line-huixian")
                .animate({
                    stroke: "#B3B3B3",
                    strokeDasharray: "5, 2"
                }, 1000)
            huixianGroup.selectAll(".dian")
                .animate({
                    stroke: "#FFFFFF",
                    fill: "#999999"
                }, 500, mina.bounce);
            huixianGroup.selectAll(".xian")
                .animate({
                    stroke: "#B3B3B3",
                    strokeDasharray: "2,2"
                }, 500);
            huixianGroup.selectAll(".wenzi")
                .animate({
                    fill: "#333333"
                }, 500);
            huixianGroup.selectAll(".yuan")
                .animate({
                    fill: "#999999"
                }, 500);
        }


        //动画部分

        var jixianTime = 4000; //基线入场时间


        //基线进入时间
        Snap.animate(0, 3000, function (x) {

            jixianPath.attr({
                d: Snap.path.getSubpath(j2, 0, x)

            });


        }, jixianTime);


        //大节点进入时间
        setTimeout(function () {
            Snap.select("#jihua").attr({
                class: "jueduidingwei show fadeInLeftBig animated"
            })
        }, jixianTime);

        setTimeout(function () {

            Snap.select("#yinhuan").attr({
                class: "jueduidingwei show fadeInUpBig animated"
            })
        }, jixianTime + 200);

        setTimeout(function () {

            Snap.select("#zhenggai").attr({
                class: "jueduidingwei show fadeInDownBig animated"
            })
        }, jixianTime + 300);

        setTimeout(function () {

            Snap.select("#wancheng").attr({
                class: "jueduidingwei show fadeInRightBig animated"
            })
        }, jixianTime + 400);


        var huixianTime = jixianTime + 400;

        //整改动画
        function huixianAnimate(id, time, color) {

            setTimeout(function () {
                Snap.selectAll(id + " .huixian-node")
                    .attr({class: "huixian-node show fadeInUpBig animated"});

                Snap.selectAll(id + " .line-huixian")
                    .attr({class: "line-huixian show fadeInDownBig animated "});

                zhenggaiXuanzhong(id, color);

                setTimeout(function () {
                    zhenggaiDefault(id)
                }, 1000);

            }, time)
        }


        //整改次数进入时间
        huixianAnimate("#huixian0-group", huixianTime + 1000, "#2E97DE");
        huixianAnimate("#huixian1-group", huixianTime + 1700, "#F15A24");
        huixianAnimate("#huixian2-group", huixianTime + 2300, "#9E005D");


        //第一次整改就通过的 红线
        var hongxianTime = huixianTime + 3000;
        setTimeout(function () {
            Snap.select("#hongxian")
                .attr({
                    class: "line-hongxian line show hongxianAnimat",
                    stroke: blueColor
                });
            //setTimeout(function () {
            //
            //    $("#hongxian2").show(2000)
            //}, 3000);

        }, hongxianTime + 1000);


        $scope.countries = [];

        setTimeout(function () {
            lh_ajax.get({
                url: "server_json/liuchengtu_jihua.json",
                success: function (msg) {
                    $scope.jihua = msg.data;
                    if ($scope.jihua) {
                        $scope.jihua.selected = msg.data[0]; //给下拉菜单默认值, 这个值是计划的id
                        $scope.jiahuaWenzi = msg.data[0].name

                        //显示当前计划的 默认隐患
                        lh_ajax.get({
                            url: "server_json/liuchengtu_yinhuan.json",
                            data: {"jihuaID": 2},
                            success: function (msg) {
                                $scope.yinhuan = msg.data;
                                $scope.yinhuan.selected = msg.data[0]; //给下拉菜单默认值, 这个值是隐患的id
                                $scope.yinhuanWenzi = msg.data[0].name;


                                aaa(msg.data[0])


                            }
                        });
                    }

                }
            });
        }, hongxianTime + 1500)

        //整改提示
        $(".procedure .dian").hover(
            function (d) {

                //var xinxin=eval('(' + $(this).attr("xinxi") + ')');
                var xinxin = $(this).data("xinxi")

                if (xinxin) {
                    $(".zhenggai-neirong").html(xinxin.neirong)
                    $(".zhenggai-time").html(xinxin.time);
                    $(".popover-public").css({top: d.clientY, left: d.clientX + 5}).show()
                }


            },
            function () {
                $(".popover-public").hide()
            }
        );


        //选中计划以后,显示当前计划下的所有隐患
        $scope.jihuaClick = function (id) {
            $scope.jiahuaWenzi = id.name;
            lh_ajax.get({
                url: "server_json/liuchengtu_yinhuan.json",
                data: {"jihuaID": id},
                success: function (msg) {
                    $scope.yinhuan = msg.data;
                    $scope.yinhuan.selected = msg.data[0]; //给下拉菜单默认值, 这个值是隐患的id,选第一条隐患
                    $scope.yinhuanWenzi = msg.data[0].name;
                    aaa(msg.data[0])
                }
            });

        };

        //选中隐患以后
        $scope.yinhuanClick = function (id) {

            $scope.yinhuanWenzi = id.name;

            aaa(id)

        };


        //把数据绑定到 节点上, 并且控制节点的颜色 来表示 整改 和复查
        function aaa(id) {
            //获取整改次数
            var zhenggaiLength = id.整改.length;

            //这段代码是重置整改节点的
            //重置
            zhenggaiDefault("#huixian0-group")
            zhenggaiDefault("#huixian1-group")
            zhenggaiDefault("#huixian2-group")
            //删除附加在 点上的数据
            $(".dian").removeData("xinxi");


            function wancheng(color){
                var wancheng = Snap.select("#wancheng")
                wancheng.select(".yuan").animate({fill:color},500)
                wancheng.select(".dian").animate({stroke:color},600)
                wancheng.select(".xian").animate({stroke:color},700)
            }

            if (zhenggaiLength) {

                for (var cishu = 0; cishu < zhenggaiLength; cishu++) {

                    $("#huixian" + cishu + "-group").find(".zuodian").data({"xinxi": id.整改[cishu].复查信息});
                    $("#huixian" + cishu + "-group").find(".youdian").data({"xinxi": id.整改[cishu].整改信息});


                    if (id.整改[cishu].状态 == true) {

                        zhenggaiXuanzhong("#huixian" + cishu + "-group", blueColor);

                        wancheng(greeColor)

                    }
                    if (id.整改[cishu].状态 == false) {


                        wancheng(huiseColor)

                        zhenggaiXuanzhong("#huixian" + cishu + "-group", redColor)
                    }


                }
            }
        }
    }


}]);

