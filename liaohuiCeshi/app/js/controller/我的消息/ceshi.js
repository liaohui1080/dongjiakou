var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务
myApp.filter("timeFormat", lhFilter.timeFormat); //新ajax服务



myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

    //加载侧边
    var listDataUrl = 'server_json/list_content.json';
    //var listDataUrl = 'server_json/list_content.json';
    var listDataHttp = function (o) {
        lh_ajax.get({
            url: listDataUrl,
            data:o,

            success: function (msg) {
                console.log(msg);
                $scope.listDatas = msg.data;

            }
        });
    };

    listDataHttp();



    //获取今天日期
    //$scope.today = new Date();
    $scope.today={
        updatedTime: $scope.today, //更新以后的时间
        up:function(){
            this.updatedTime = moment(this.updatedTime).subtract(1, 'day');
            listDataHttp(this.updatedTime);
        },
        down:function(){
            this.updatedTime = moment(this.updatedTime).add(1, 'day');
            listDataHttp(this.updatedTime);
        }
    };


    $scope.changeStatus=function(row){

        lh_ajax.get({
            url: listDataUrl,
            infoShow:true,
            data:row,
            success: function (msg) {
                console.log(row);


            }
        });
    }
}]);

