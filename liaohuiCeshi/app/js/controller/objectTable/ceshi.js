/**
 * Created by liaohui1080 on 16/2/26.
 *
 * 控制器创建页面
 */


var listUserLogin = (function () {


    var listUserLogin = ['$scope', 'lh_http', 'cfpLoadingBar','ngNotify','$timeout',
        function ($scope, lh_http, cfpLoadingBar,ngNotify,$timeout) {
            ngNotify.config({
                position: 'top',
                duration: 1000,

            });

            $scope.userLists=[];



            //发送到服务器
            lh_http.get({
                url: pageUrl.userAdminManage.listUserLogin.userList.url,

                success: function (msg) {

                    if (msg.status) {
                        $scope.userLists=msg.data;
                        console.log(msg.data)
                    } else {
                        alert("数据格式不正确")
                    }
                },
                error: function () {
                    alert("服务器错误")
                }
            });


            $scope.userListRowBianji=function(row){
                console.log(row);
            }


            $scope.addUser=function(){
                console.log("xinjian")
                $("#userListAdd").modal('show');
            }



            //刷新数据
            $scope.shuaxin=function(){

                console.log($scope.formData)
                lh_http.get({
                    url: pageUrl.userAdminManage.listUserLogin.userList2.url,

                    success: function (msg) {

                        if (msg.status) {
                            $scope.userLists=msg.data;
                            console.log(msg.data)
                        } else {
                            alert("数据格式不正确")
                        }
                    },
                    error: function () {
                        alert("服务器错误")
                    }
                });
            }

            $scope.shuaxin2=function(){
                lh_http.get({
                    url: pageUrl.userAdminManage.listUserLogin.userList.url,

                    success: function (msg) {

                        if (msg.status) {
                            $scope.userLists=msg.data;
                            //console.log(msg.data)
                        } else {
                            alert("数据格式不正确")
                        }
                    },
                    error: function () {
                        alert("服务器错误")
                    }
                });
            }




            //删除表格数据
            $scope.userListRowShanchu = function (row) {

                var del =confirm("确认删除");

                if(del==true){

                    cfpLoadingBar.start();
                    //从服务器删除
                    lh_http.get({
                        url: pageUrl.userAdminManage.listUserLogin.userListShanchu.url,
                        data: {id: 1},
                        success: function (msg) {
                            cfpLoadingBar.complete();
                            if (msg.status) {

                                //获取行数据
                                var index = $scope.userLists.indexOf(row);
                                console.log($scope.userLists[index]);
                                $scope.userLists.splice(index, 1);
                                //console.log($scope.userLists);

                                ngNotify.set('删除成功','success');

                            } else {
                                alert("数据格式不正确")
                                ngNotify.set('数据格式不正确','warn');
                            }
                        },
                        error: function () {
                            //alert("服务器错误");
                            ngNotify.set('服务器错误','error');
                        }
                    });
                }

            };


        }];





    return {
        listUserLogin: listUserLogin,



    }
})();






var myApp=angular.module('myApp', [
    'objectTable',
    "w5c.validator", //表单验证
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条

    'ngNotify' //弹出提示

]);






//进度条配置
myApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);


//表单验证配置
myApp.config(["w5cValidatorProvider", function (w5cValidatorProvider) {

    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: true,
        removeError: true

    });

    w5cValidatorProvider.setRules({
        userLoginId: {
            required: "用户标示不能为空"
        },

        partyGroupIdInfo: {
            required: "请选择所在企业"
        },


        currentPassword: {
            required: "密码不能为空"
        },
        currentPasswordVerify: {
            required: "重复密码不能为空",
            repeat: "两次密码输入不一致"
        },



    });
}]);





//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);
myApp.filter("YNtoHanzi", lhFilter.YNtoHanzi);
myApp.filter("YNtoZaixian", lhFilter.YNtoZaixian);


//factory  服务添加位置
myApp.factory("lh_http", lhFactory.http);






myApp.controller('listUserLogin', listUserLogin.listUserLogin);



