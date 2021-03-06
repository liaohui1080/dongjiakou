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

        //权限
        $scope.quanxians = {};


        //用户关联显示判断
        $scope.guanlianShow = {};

        //用户关联数据
        $scope.guanlianUser = {};

        //加载权限列表
        lh_ajax.get({
            url: "server_json/tree1.json",
            success: function (msg) {
                console.log(msg);
                $scope.quanxians = msg.data;

            }
        });


        //lh_http.get({
        //    url: "http://localhost:9090/proxy/127.0.0.1:1337/index.js?abc=100",
        //    success: function (msg) {
        //        console.log("跨域");
        //        console.log(msg);
        //
        //
        //    },error:function(e){
        //
        //        console.log("服务器错误")
        //        console.log(e);
        //    }
        //});

        //权限修改事件
        $scope.changeCallback = function (row) {
            console.log(row);

            //禁用权限按钮
            row.switch=true;
            lh_ajax.get({
                url: "server_json/tree1.json",
                infoShow: true,
                success: function (msg) {
                    console.log(msg);
                    console.log("发送权限修改成功");

                    //启用权限按钮
                    row.switch=false;

                }
            });
        };


        //加载所有用户信息,给ui-select使用
        lh_ajax.get({
            url: "server_json/user_list.json",
            success: function (msg) {
                console.log(msg);
                $scope.userLists = msg.data;
                //$scope.userLists.partyId="partyId3";
            }
        });


        //加载账号信息
        lh_ajax.get({
            url: "server_json/zhanghao.json",
            success: function (msg) {
                console.log(msg);

                $scope.zhanghao = msg.data;


                if (msg.data.partyId) {

                    //加载已关联用户信息 通过partyid 查找
                    guanlianAjax(msg.data.partyId)
                } else {
                    $scope.guanlianShow = false;
                }

            }
        });


        //关联事件
        $scope.guanlianClick = function (id) {

            //加载关联用户信息
            lh_ajax.get({
                url: "server_json/user_guanlian.json",
                data: {partyId: id},
                success: function (msg) {
                    console.log(msg);

                    guanlianAjax(id)

                }
            });

        };


        function guanlianAjax(partyId) {
            lh_ajax.get({
                url: "server_json/user_guanlian.json",
                data: {partyId: partyId},
                success: function (msg) {
                    console.log(msg);
                    $scope.guanlianUser = msg.data;
                    $scope.guanlianShow = true; //显示关联用户界面

                }
            });
        }


    }]);

