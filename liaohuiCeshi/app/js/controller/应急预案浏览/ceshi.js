var myApp = angular.module('myApp', [
    "angular-loading-bar", //加载进度条=
    'ngNotify',//弹出提示
    "ngSanitize", // 输出html
    "w5c.validator",

]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);




//时间格式化 timeFormat:'YYYY年MM月DD日 DD=星期,必须大写星期才能输出正确 H:mm:ss'
myApp.filter("timeFormat", [function () {
    return function (input, str) {
        return moment(input).format(str)
    }

}]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController',['$scope', '$log', 'lh_ajax', '$timeout',function($scope, $log, lh_ajax, $timeout){

}]);

