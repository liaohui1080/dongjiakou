var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax2); //新ajax服务


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {


    var dataset = [1, 4, 2, 2, 2];
    //var dataset = [ 250 , 210 , 170 , 130 , 90 ];  //数据（表示矩形的宽度）
    var rectWidth = 25;   //每个矩形所占的像素高度(包括空白)
    //画布周边的空白
    var padding = {left: 30, right: 30, top: 30, bottom: 30};
    var width = 500;  //画布的宽度
    var height = 500;   //画布的高度

    var svg = d3.select(".tuxing")     //选择文档中的body元素
        .append("svg")          //添加一个svg元素
        .attr("width", width)       //设定宽度
        .attr("height", height)   //设定高度
        .attr("class", "bg")


    //定义比例尺
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, 400]);


    svg.selectAll(".MyRect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "MyRect")

        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")



        .attr("fill", "red")

        .attr("height", function (d) {

            return 0;
        })
        .attr("y", function (d, i) {

            return height -60;
        })
        .attr("width", 0)


        .transition()
        .duration(2000) //指定过度时间
        .ease("bounce")  //指定过度效果
        .delay(function (d, i) { //指定延迟时间,可根据数据的顺序依次延时播放
            return i*500;

        })

        .attr("fill", "steelblue")

        .attr("width", rectWidth - 5)
        .attr("x", function (d, i) {

            return i * rectWidth;
        })

        .attr("y", function (d, i) {

            return height - yScale(d) - 60;
        })
        .attr("height", function (d) {

            return yScale(d);
        });


    //x坐标
    var Xaxis = d3.svg.axis()
        .scale(yScale)		//指定比例尺
        .orient("bottom")	//指定刻度的方向
        .ticks(7);			//指定刻度的数量

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(30," + (height - 30) + ")")
        .call(Xaxis);
    //添加文字元素
    svg.selectAll(".MyRect")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "MyText")
        .text(function (d) {
            return "撒大法师打";
        });


}]);

