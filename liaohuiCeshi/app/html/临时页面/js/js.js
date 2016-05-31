/**
 * Created by liaohui1080 on 16/5/26.
 */
var myApp = angular.module('myApp', [

    "ngSanitize", // 输出html

]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

        //初始化表单
        $scope.myForm = [
            {name: null, age: null, sex: null}
        ];


        $scope.clickAddRow = function (row) {

            row.active = true; //判断按钮是否显示
            // console.log(row)
            $scope.myForm.push({name: null, age: null, sex: null})

        };

        $scope.clickSubmit=function () {
            console.log($scope.myForm)
            lh_ajax.get({
                url:"server_json/应急资源.json",
                data:$scope.myForm,
                success:function (msg) {

                }
            })
        }


    }]);