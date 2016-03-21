/**
 * Created by liaohui1080 on 16/2/26.
 *
 * 控制器创建页面
 */


var listUserLogin = (function () {


    var listUserLogin = ['$scope', 'lh_http', 'cfpLoadingBar','lhTable','ngNotify',
        function ($scope, lh_http, cfpLoadingBar,lhTable,ngNotify) {
            ngNotify.config({
                position: 'top',
                duration: 1000,

            });


            console.log('listUserLogin');

            //ngNotify.set('Your error message goes here!', 'error');

            cfpLoadingBar.start();
            $scope.userLists = [];
            $scope.userListSousuo = '';

            $scope.dtInstance = {};
            $scope.dtOptions=lhTable.options({shu:4});


            //加载表格数据
            lh_http.get({
                url: pageUrl.userAdminManage.listUserLogin.userList.url,
                success: function (msg) {
                    cfpLoadingBar.complete();
                    if (msg.status) {

                        $scope.userLists = msg.data;
                        //这里是分页参数



                    } else {
                        alert("数据格式不正确")
                    }
                },
                error: function () {
                    alert("服务器错误")
                }
            });




            //加载所有企业数据
            lh_http.get({
                url: pageUrl.userAdminManage.listUserLogin.searchCompany.url,
                success: function (msg) {
                    cfpLoadingBar.complete();
                    if (msg.status) {
                        $scope.$broadcast('to-qiyeList', msg.data);
                        //console.log(msg.data);
                    } else {
                        alert("数据格式不正确")
                    }
                },
                error: function () {
                    alert("服务器错误")
                }
            });


            //删除表格数据
            $scope.userListRowShanchu = function (row) {
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
                            //console.log($scope.userLists[index]);
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

            };


            //弹出层,并将现在选中的这一行数据发送给其他控制器
            $scope.userListRowBianji = function (row) {
                //cfpLoadingBar.start();
                $("#userListBianji").modal('show');

                //获取行数据
                var index = $scope.userLists.indexOf(row); //获取行号
                var rowData = $scope.userLists[index]; //通过行号获取数据

                //发送数据{index:行号,data:本行数据}
                $scope.$broadcast('to-userListBinaji', {index: index, data: rowData});


            };


            //增加新数据
            $scope.userListRowAdd = function () {
                console.log('userListRowAdd');
                $("#userListAdd").modal('show');

                //发消息让子控制器清空表单清空表单内容
                $scope.$broadcast('to-userListAdd','清空表单');

            };

            //接收到编辑好的参数,并绑定到数据里
            $scope.$on('to-userListHangBianji', function (e, msg) {


                //重新加载数据
                $scope.dtInstance.rerender();

                ngNotify.set('成功','success');
            });


            //接受新增的消息
            $scope.$on('to-userListHangAdd', function (e, msg) {

                console.log('to-userListHangAdd');

                //重新加载数据
                $scope.dtInstance.rerender();
                //alert("成功");
                ngNotify.set('成功',{
                    type: 'success',
                    position: 'top',
                });
            });


        }];


    //增加新用户
    var userListAdd = ['$scope', 'lh_http', 'cfpLoadingBar', function ($scope, lh_http, cfpLoadingBar) {

        console.log('userListAdd');
        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };

        //是否强制更新密码选择下拉菜单数据
        addForm.types = [
            {
                value: "N",
                name: "N"
            },
            {
                value: "Y",
                name: "Y"
            }
        ];


        //清空表单内容
        $scope.$on('to-userListAdd',function(onMsg){

            addForm.entity={};
            //console.log("清空表单")
        });

        //接收企业列表参数 , 把数据存储在 $scope.qiyeLists 以便于别的地方可以调用
        $scope.$on('to-qiyeList', function (e, data) {
            //console.log(data); // hello
            $scope.qiyeLists = data;

        });

        //保存按钮
        addForm.save = function (e) {
            cfpLoadingBar.start();
            var dataAdd ={

                userLoginId:addForm.entity.userLoginId,
                currentPassword:addForm.entity.currentPassword,
                currentPasswordVerify:addForm.entity.currentPasswordVerify,
                passwordHint:addForm.entity.passwordHint,
                requirePasswordChange:addForm.entity.requirePasswordChange,
                partyGroupId:addForm.entity.partyGroupId,


            };

            console.log(dataAdd);
            //发送到服务器
            lh_http.post({
                url: pageUrl.userAdminManage.listUserLogin.addUser.url,
                data: dataAdd,
                success: function (msg) {
                    cfpLoadingBar.complete();
                    if (msg.status) {
                        cfpLoadingBar.complete();
                        //发消息给主控制器跟新表格数据
                        $scope.$emit('to-userListHangAdd', msg.data);

                        $("#userListAdd").modal('hide');

                    } else {
                        alert("数据格式不正确")
                    }
                },
                error: function () {
                    alert("服务器错误")
                }
            });
        };

    }];

    var userListBianji = ['$scope', 'lh_http', 'cfpLoadingBar', function ($scope, lh_http, cfpLoadingBar) {
        console.log('userListBianji');

        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };


        //是否强制更新密码选择下拉菜单数据
        addForm.types = [
            {
                value: "N", name: "N"
            },
            {
                value: "Y",
                name: "Y"
            }
        ];


        //接受父控制传过来的表格行数据, 并把数据赋值给表单
        $scope.$on('to-userListBinaji', function (e, onMsg) {
            //console.log(data); // hello
            console.log("收到 to-userListBinaji"); // hello

            addForm.entity={};

            //是否强制更新密码选择
            addForm.entity.requirePasswordChange = onMsg.data.requirePasswordChange;

            //所在企业选择
            $scope.qiyeLists.partyGroupId = onMsg.data.partyGroupId;

            //用户id
            addForm.entity.userLoginId = onMsg.data.userLoginId;


            //保存按钮
            addForm.save = function (e) {
                console.log($scope.qiyeLists.partyGroupId);
                console.log(addForm.entity.requirePasswordChange);
                console.log(addForm.entity.userLoginId);
                console.log($scope.qiyeLists.partyGroupId);
                cfpLoadingBar.start();

                //发送到服务器
                lh_http.post({
                    url: pageUrl.userAdminManage.listUserLogin.userListBianji.url,
                    data: {
                        userLoginId: addForm.entity.userLoginId,
                        requirePasswordChange: addForm.entity.requirePasswordChange,
                        partyGroupId: $scope.qiyeLists.partyId
                    },
                    success: function (msg) {
                        cfpLoadingBar.complete();
                        if (msg.status) {

                            //发消息给主控制器
                            $scope.$emit('to-userListHangBianji', {index: onMsg.index, data: msg.data});


                            $("#userListBianji").modal('hide');

                        } else {
                            alert("数据格式不正确")
                        }
                    },
                    error: function () {
                        alert("服务器错误")
                    }
                });
            };
        });

        addForm.entity.reset=function(){
            console.log("sdfsdfsdfsdfsd")
        }


        //接收企业列表参数 , 把数据存储在 $scope.qiyeLists 以便于别的地方可以调用
        $scope.$on('to-qiyeList', function (e, data) {
            //console.log(data); // hello
            $scope.qiyeLists = data;

        });


    }];


    return {
        listUserLogin: listUserLogin,
        userListAdd: userListAdd,
        userListBianji: userListBianji,


    }
})();






var myApp=angular.module('myApp', [
    "w5c.validator", //表单验证
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条
    'datatables',  //表格
    'datatables.bootstrap', //bootstrap样式表格
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





//filter 过滤器
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


//factory  服务添加位置
myApp.factory("lh_http", lhFactory.http);
myApp.factory("lhTable", lhTable.table);



myApp.controller('listUserLogin', listUserLogin.listUserLogin);
myApp.controller('userListAdd', listUserLogin.userListAdd);
myApp.controller('userListBianji', listUserLogin.userListBianji);


