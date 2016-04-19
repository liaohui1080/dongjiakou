var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax2); //新ajax服务


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {



    var dataset = [ 250 , 210 , 170 , 130 , 90 ];  //数据（表示矩形的宽度）
    var rectHeight = 25;   //每个矩形所占的像素高度(包括空白)

    var width = 500;  //画布的宽度
    var height = 300;   //画布的高度

    var svg = d3.select(".tuxing")     //选择文档中的body元素
        .append("svg")          //添加一个svg元素
        .attr("width", width)       //设定宽度
        .attr("height", height)   //设定高度
        .attr("class", "bg")


    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x",0)
        .attr("y",10)
        .attr("y",function(d,i){
            console.log(rectHeight-2)
            return i * rectHeight;
        })
        .attr("width",function(d){
            return d;
        })
        .attr("height",rectHeight-10)
        .attr("fill","steelblue");




}]);

