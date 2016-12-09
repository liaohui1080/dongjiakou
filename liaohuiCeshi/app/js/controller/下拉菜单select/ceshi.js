var myApp = angular.module('myApp', [
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "w5c.validator",
    "angular-loading-bar", //加载进度条=
    'ngNotify' //弹出提示


]);


//进度条配置
myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
}]);


//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController',
    ['$scope', 'lh_ajax', function ($scope, lh_ajax) {


        lh_ajax.get({
            url: "server_json/user_list.json",
            success: function (msg) {
                $scope.countries = msg.data;

            }
        });




        $scope.dianji = function (m) {


            console.log(m);

            if (m == 1) {
                $scope.renyuanShow = false;
                lh_ajax.get({
                    url: "server_json/user_list33.json",
                    success: function (msg) {
                        $scope.dier = msg.data;
                    }
                });
            }

            if (m == 2) {
                lh_ajax.get({
                    url: "server_json/user_list4.json",
                    success: function (msg) {
                        $scope.dier = msg.data;

                        $scope.renyuanShow = true;
                    }
                });
            }


        }


    }]);

