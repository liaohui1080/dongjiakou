var myApp = angular.module('myApp', [

    "w5c.validator",
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'treeGrid'

]);


//进度条配置
myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
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
        childname: {
            required: "名称不能为空"
        }


    });
}]);


//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('zuzhijiagou', ['$scope', 'lh_ajax',
    function ($scope, lh_ajax) {


        $scope.tree_data = [];

        //获取第一级数
        lh_ajax.get({
            url: "server_json/tree2.json",

            success: function (msg) {
                console.log(msg.data);
                $scope.tree_data = msg.data
            }
        });



        //刷新
        var refresh = function(){
            lh_ajax.get({
                url: "server_json/tree2.json",
                infoSuccess:"成功",
                success: function (msg) {
                    console.log(msg.data);
                    $scope.tree_data = msg.data
                }
            });
        }







        //设置tree 标题
        $scope.col_name = [

            {field: "childname", displayName: "部门名字"},
            {field: "phoneNumber", displayName: "电话"},
            {field: "email", displayName: "邮箱"},
            {
                field: "",
                displayName: "",
                cellTemplate: '' +

                    //部门
                '<button title="新建" class="btn btn-xs btn-primary " ng-click="cellTemplateScope.add(row.branch)" ng-if=row.branch.type=="department"><li class="glyphicon glyphicon-plus"></li></button>\n' +
                '<button class="btn btn-xs btn-success"  ng-click="cellTemplateScope.edit(row.branch)" ng-if=row.branch.type=="department"><li class=" glyphicon glyphicon-pencil"></li></button>\n' +
                '<button  class="btn btn-xs btn-danger " ng-click="cellTemplateScope.del(row.branch)" ng-if=row.branch.type=="department"><li class="glyphicon glyphicon-trash"></li></button>\n' +


                    //人员
                '<button class="btn btn-xs btn-success "  ng-click="cellTemplateScope.edit(row.branch)" ng-if=row.branch.type=="person"><li class="glyphicon glyphicon-pencil"></li></button>\n' +
                '<button class="btn btn-xs btn-danger " ng-click="cellTemplateScope.del(row.branch)" ng-if=row.branch.type=="person"><li class="glyphicon glyphicon-trash"></li></button>\n'+

                //公司
                '<button class="btn btn-xs btn-success "  ng-click="cellTemplateScope.add(row.branch)" ng-if=row.branch.type=="company"><li class="glyphicon glyphicon-plus"></li></button>\n' ,

                cellTemplateScope: {
                    add: function (data) {         // this works too: $scope.someMethod;
                        //console.log(data);
                        $("#add").modal("show");
                        $scope.$broadcast("to-treeRow", data);

                    },
                    edit: function (data) {         // this works too: $scope.someMethod;
                        //console.log(data);
                        $("#edit").modal("show");
                        $scope.type=data.type
                        $scope.$broadcast("to-treeRow", data);

                    },
                    del: function (data) {         // this works too: $scope.someMethod;
                        //console.log(data);




                        var yes=confirm("确认删除?");
                        if(yes==true){
                            console.log("Asdfasdf")
                            refresh();

                        }

                    }
                }
            }

        ];


        //获取子节点数据
        $scope.my_tree_handler = function (row) {
            lh_ajax.get({
                url: 'server_json/tree2.json',
                data: {id: 1},
                success: function (msg) {
                    console.log(msg.data);
                    if (msg.data) {
                        row.children = msg.data
                    }
                }
            });


        };



        //刷新tree
        $scope.$on('to-shuaxin', function (e, data) {
            //获取第一级数
            refresh();
        })

    }]);


myApp.controller('addBumen', ['$scope','lh_ajax',
    function ($scope,lh_ajax) {
        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };


        //增加新节点
        $scope.$on('to-treeRow', function (e, data) {
            console.log(data);

            addForm.save=function(){
                lh_ajax.get({
                    url: "server_json/tree2.json",
                    data:{id:"节点id"},
                    success: function (msg) {
                        console.log(msg.data);
                        $scope.$emit('to-shuaxin',msg.data);
                        $("#add").modal("hide");
                        addForm.entity={};
                    }
                });
            }
        })


    }]);


myApp.controller('addUser', ['$scope','lh_ajax',
    function ($scope,lh_ajax) {
        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };


        //增加新节点
        $scope.$on('to-treeRow', function (e, data) {
            console.log(data);

            addForm.save=function(){
                lh_ajax.get({
                    url: "server_json/tree2.json",
                    data:{id:"节点id"},
                    success: function (msg) {
                        console.log(msg.data);
                        $scope.$emit('to-shuaxin',msg.data);
                        $("#add").modal("hide");
                        addForm.entity={};
                    }
                });
            }
        })


    }]);


myApp.controller('editBumen', ['$scope','lh_ajax',
    function ($scope,lh_ajax) {
        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };


        //编辑
        $scope.$on('to-treeRow', function (e, data) {
            console.log(data);
            addForm.entity.childname=data.childname;


            addForm.save=function(){
                lh_ajax.get({
                    url: "server_json/tree2.json",
                    data:{id:"节点id"},
                    success: function (msg) {
                        console.log(msg.data);
                        $scope.$emit('to-shuaxin',msg.data);
                        $("#edit").modal("hide");
                        addForm.entity={};
                    }
                });
            }
        })


    }]);


//编辑用户
myApp.controller('editUser', ['$scope','lh_ajax',
    function ($scope,lh_ajax) {
        //form表单验证参数
        var addForm = $scope.addForm = {
            htmlSource: "",
            showErrorType: 1,
            showDynamicElement: true,
            entity: {}
        };


        //编辑
        $scope.$on('to-treeRow', function (e, data) {
            console.log(data);
            addForm.entity.childname=data.childname;


            addForm.save=function(){
                lh_ajax.get({
                    url: "server_json/tree2.json",
                    data:{id:"节点id"},
                    success: function (msg) {
                        console.log(msg.data);
                        $scope.$emit('to-shuaxin',msg.data);
                        $("#edit").modal("hide");
                        addForm.entity={};
                    }
                });
            }
        })


    }]);