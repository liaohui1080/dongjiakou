var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务
myApp.directive("wangEdit", wangEditDirective.wangEdit); //加载编辑器
myApp.directive("wangedit2", wangEditDirective.wangEdit); //加载编辑器


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

    $scope.editorContent = '';

    //加载侧边
    var sideListUrl = 'server_json/side_list.json';
    // var sideListUrl = 'http://www.baidu.com';
    var sideListHttp = function () {
        lh_ajax.get({
            url: sideListUrl,
            success: function (msg) {
                console.log(msg);
                $scope.sideListData = msg.data;

            }
        });
    };

    sideListHttp();


    //加载右侧内容
    var listContent = 'server_json/list_content.json';
    var listContentHttp = function (msgData) {
        lh_ajax.get({
            url: listContent,
            data: msgData,
            success: function (msg) {
                console.log(msg);
                $scope.listContentData = msg.data;

            }
        });
    };
    listContentHttp();


    //左侧list的点击事件,传过来 listID
    $scope.sideListClick = function (id) {

        listContentHttp({listID: id});
    };


    //右侧内容 修改按钮
    $scope.listContentEditClick = function (row) {


        console.log(row.lc);
        lh_ajax.get({
            url: listContent,
            data: row.lc,
            success: function (msg) {
                console.log(msg);
                row.listContentEdit = false;

            }
        });

    };

    //右侧内容 删除按钮
    $scope.listContentDel = function (row) {


        if(confirm("确定删除吗？"))

        {

            //如果是true ，那么就把页面转向thcjp.cnblogs.com
            var rowNumber = $scope.listContentData.indexOf(row.lc);
            $scope.listContentData.splice(rowNumber, 1);
            lh_ajax.get({
                url: listContent,
                data: row.lc,
                success: function (msg) {
                    console.log(msg);
                    row.listContentEdit = false;

                }
            });
        }
        //显示 没有数据状态
        if ($scope.listContentData.length <= 0) {
            $scope.listContentData = null;
        }

    };

    //右侧内容 新增
    $scope.listContentAddClick=function(row){

     console.log(row)
        lh_ajax.get({
            url: listContent,
            data: row,
            success: function (msg) {
                console.log(msg);

                $scope.listContentData.push(row)
            }
        });



    };


    //右侧内容 修改form里的取消按钮 listContentCancelClick
    $scope.listContentCancelClick = function (row) {

        //使用copy的数据来恢复内容
        row.lc=$scope.abc;

    };

    //右侧内容 点击编辑的时候 copy这一行的数据. 以便于在取消的时候恢复数据
    $scope.copyListContent=function(row){
        $scope.abc= angular.copy(row.lc);

    };




    //左侧列表 点击事件
    $scope.copySideListClick = function(row){
        $scope.copySideList=angular.copy(row.sl);
    };

    //左侧列表 修改事件
    $scope.clickSideListEdit=function(row){
        console.log(row);
        $("#sideList li .input-group").hide();
        $("#sideList li .sl-name").show();

        lh_ajax.get({
            url: listContent,
            data: row.lc,
            success: function (msg) {
                console.log(msg);


            }
        });
    };

    //左侧列表 删除事件
    $scope.clickSideListDel=function(row){
        console.log(row);


        if(confirm("确定删除吗？"))

        {


            lh_ajax.get({
                url: sideListUrl,
                data: row.lc,
                success: function (msg) {
                    console.log(msg);

                    $("#sideList li .input-group").hide();
                    $("#sideList li .sl-name").show();

                    var rowNumber = $scope.sideListData.indexOf(row.sl);
                    $scope.sideListData.splice(rowNumber, 1);

                }
            });
        }
    };

    //左侧列表 增加事件
    $scope.clickSideListAdd=function(row){
        lh_ajax.get({
            url: listContent,
            data: row,
            success: function (msg) {
                console.log(msg);
                $scope.sideListData.push(row)

            }
        });

    };



    //左侧列表 是否显示 编辑按钮
    $("#sideList").on("click", "li i", function (e) {

        var thisA = $(this).parents(".sl-li");

        thisA.nextAll().find(".input-group").hide();
        thisA.prevAll().find(".input-group").hide();
        thisA.nextAll().find(".sl-name").show();
        thisA.prevAll().find(".sl-name").show();


        thisA.find(".sl-name").hide();
        thisA.find(".input-group").show();

    }).on("click", "li .sl-close", function (e) {

        var thisA = $(this).parents(".sl-li");

        thisA.find(".input-group").hide();

        thisA.find(".sl-name").show();
    });


}]);

