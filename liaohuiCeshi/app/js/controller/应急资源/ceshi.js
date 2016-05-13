var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html
    'objectTable',
]);

//设置滚动条样式
$('.panel-scroll').slimScroll({
    //color: '#00f',
    size: '5px',
    height: '400px',
    alwaysVisible: true

});


//由于objectTable不支持嵌套循环, 所以在表格里用这个指令来显示子循环
myApp.directive("xunhuan",function(){
    return {
        restrict:"EA",
        scope: {
            data: "="

        },
        link:function(scope,ele,attr,ctrl){

            angular.forEach(scope.data, function(value) {
                console.log(value)
                ele.append('<li class=" text-muted">' +
                    '<i class="fa '+value.icon+'"></i>' +
                    '' +value.name+'' +
                    '</li>');
            });

        }
    }
});

//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController', ['$scope',  'lh_ajax', '$timeout', function ($scope,  lh_ajax, $timeout) {


    //应急队伍
    lh_ajax.get({
        url:"server_json/应急资源.json",
        success:function(msg){
            $scope.ranks= msg.data;
            console.log(msg.data)
        }
    });



    //应急通讯录
    lh_ajax.get({
        url:"server_json/应急资源.json",
        success:function(msg){
            $scope.bookList= msg.data;
            console.log(msg.data)
        }
    });



    //应急医疗
    lh_ajax.get({
        url:"server_json/应急资源.json",
        success:function(msg){
            $scope.rescue= msg.data;
            console.log(msg.data)
        }
    });


    //应急专家
    lh_ajax.get({
        url:"server_json/应急资源.json",
        success:function(msg){
            $scope.expert= msg.data;
            console.log(msg.data)
        }
    });



    //最后面表格
    lh_ajax.get({
        url:"server_json/应急资源.json",
        success:function(msg){
            $scope.resources= msg.data;
            console.log(msg.data)
        }
    });


    //电话呼叫事件
    $scope.clickCall=function(row){
        console.log(row)
    }

}]);

