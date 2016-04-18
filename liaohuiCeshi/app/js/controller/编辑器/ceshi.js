var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax2); //新ajax服务
myApp.directive("wangEdit", wangEditDirective.wangEdit); //加载编辑器

//myApp.directive('wangEdit', function() {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        scope: {
//            parameter: "=", //自定义菜单
//            editData:"=" //给编辑器初始化值
//        },
//        link: function (scope, element, attrs, ctrl) {
//
//
//            // 创建编辑器
//            var editor = new wangEditor(element);
//
//            editor.onchange = function () {
//                // 从 onchange 函数中更新数据
//                scope.$apply(function () {
//                    var html = editor.$txt.html();
//                    ctrl.$setViewValue(html);
//                });
//            };
//
//            // 自定义菜单 ,通过 parameter来获取 菜单参数
//            editor.config.menus = scope.parameter;
//
//            editor.create();
//
//            //给编辑器初始化值
//            editor.$txt.html(scope.editData);
//        }
//    };
//});

myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {
    $scope.abc='';

    //加载右侧内容
    var listContent = 'server_json/list_content.json';
    var listContentHttp = function (msgData) {
        lh_ajax.get({
            url: listContent,
            data: msgData,
            success: function (msg) {
                console.log(msg);
                $scope.listContentData = msg.data;
                $scope.abc = angular.copy( $scope.listContentData)
            }
        });
    };

    $scope.editcontent="";

    $scope.dianji=function(row){
        console.log("dianji")

        //console.log($scope.abc)
        //$scope.listContentData='';
        //$scope.listContentData=$scope.abc;
        //
        angular.forEach($scope.listContentData,function(row){
            //row.show=false;
        });

        $scope.editcontent="<p>初始化编辑器值</p>"
        row.show=true;
        console.log($scope.listContentData)


    };
    listContentHttp();


}]);

