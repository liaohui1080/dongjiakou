var myApp = angular.module('myApp', [
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "w5c.validator",
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'uiSwitch'

]);


//进度条配置
myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
}]);


//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);
myApp.filter("YNtoHanzi", lhFilter.YNtoHanzi);



//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务
myApp.factory("lh_http", lhFactory.http); //新ajax服务


myApp.controller('rootController',
    ['$scope', 'lh_ajax','lh_http', function ($scope, lh_ajax,lh_http) {




    }]);

