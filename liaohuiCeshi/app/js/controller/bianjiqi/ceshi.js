var myApp = angular.module('myApp', [


    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条

    'ngNotify' //弹出提示

]);


//进度条配置
myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);


//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);
myApp.filter("YNtoHanzi", lhFilter.YNtoHanzi);
myApp.filter("YNtoZaixian", lhFilter.YNtoZaixian);


//factory  服务添加位置
myApp.factory("lh_http", lhFactory.http);



myApp.controller('bianjiqi', ['$scope', 'lh_http', 'cfpLoadingBar', 'ngNotify', '$timeout',
    function ($scope, lh_http, cfpLoadingBar, ngNotify, $timeout) {
        ngNotify.config({
            position: 'top',
            duration: 1000,

        });
        //
        var editor = new wangEditor('div1');
        editor.create();
        $scope.xianshi=function(){
            editor.$txt.html();
            console.log(editor.$txt.html());
        }

        editor.onchange = function () {
            // 编辑区域内容变化时，实时打印出当前内容
            console.log(this.$txt.html());
        };

        console.log("bianjiqi")
    }]);



