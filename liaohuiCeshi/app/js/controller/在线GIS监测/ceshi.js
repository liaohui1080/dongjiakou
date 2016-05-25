var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html

]);

//设置滚动条样式
$('.panel-scroll').slimScroll({
    //color: '#00f',
    size: '5px',
    height: '400px',
    alwaysVisible: true

});


$(".GIS-view").height($(".page-content").height()-100)

//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController', ['$scope',  'lh_ajax', '$timeout', function ($scope,  lh_ajax, $timeout) {


  

}]);

