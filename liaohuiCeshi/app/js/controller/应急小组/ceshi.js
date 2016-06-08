var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html
    'objectTable',
    'treeGrid'


]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController', ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout){

    //table数据
    $scope.tableData='';


    //内部树
    $scope.tree_data = [];



    //发送到服务器
    lh_ajax.get({
        url: 'server_json/user_list.json',

        success: function (msg) {

            $scope.tableData=msg.data;
        }
    });

    //用于table增删改查的ajax
    $scope.ajaxAction=function (o) {
        //发送到服务器
        lh_ajax.get({
            url: 'server_json/user_list.json',
            data:o,
            infoShow:true,
            success: function (msg) {

                $scope.tableData=msg.data;
            }
        });
    };




    $(window).resize(function(e){

        $(".grid-tree").css({width:$(".col-md-12").width()})
    });

    //展开行事件
    $scope.clickTrOpen=function (row,td) {

        //
        // $(td).nextAll().find("td").removeClass('tr-open')
        // $(td).prevAll().find("td").removeClass('tr-open')
        // $(".grid-tree").hide(100);
        //
        // $(td).find("td").addClass('tr-open')
        // var p = $(td).find("td");
        // var offset = p.offset();
        // console.log( "left: " + offset.left + ", top: " + offset.top );
        // $(".grid-tree").css({top: offset.top-100, width:$(".col-md-12").width()}).show(300)


        lh_ajax.get({
            url: 'server_json/tree1.json',
            data: {id: 1},
            success: function (msg) {
                console.log(msg.data);
                if (msg.data) {
                    $scope.tree_data = msg.data
                }
            }
        });
    };

    $scope.tableEdit={};
    //编辑表格行事件
    $scope.clickTableEidt=function (row) {
        $('#tableEdit').modal('show');
        $scope.rowCopy=angular.copy(row); //拷贝一份原始数据, 以便于还原的时候使用
        $scope.tableEdit=row;
    };
    //编辑报个行按钮动作
    $scope.clickTableEditBtn=function (row) {
        row.action='edit'; //编辑参数
        $scope.ajaxAction(row);

        $('#tableEdit').modal('hide');
    };
    //关闭弹出层 还原数据
    $scope.clickTableEditBtnClose=function (row) {
        var rowNumber = $scope.tableData.indexOf(row);
        $scope.tableData[rowNumber]= $scope.rowCopy; //使用copy数据还原

    };

    //删除表格行事件
    $scope.clickTableDel=function (row) {

        //信息框-例2
        layer.msg('确定删除吗？', {
            time: 0 //不自动关闭
            ,btn: ['确定', '取消']
            ,yes: function(index){
                layer.close(index);
                row.action='del'; //删除参数
                $scope.ajaxAction(row);
            }
        });


    };



    //上传文件
    $scope.clickFlieUpdate=function () {
        console.log("上传文件方法写这里");
        $("#tableUpdate").modal("hide")
    };

    //查看附件
    $scope.clickTableSeeFile=function(file){
        console.log(file)
        $scope.tableFile=file;
    };







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
        console.log("刷新")
        //获取第一级数
        $scope.refresh();
    });


    $scope.treeEdit={}; //选中的行数据
    $scope.treeCopyRowData={}; //选中的行数据copy
    $scope.treeNumber=0; //当前选中数据的行号
    //设置tree 标题
    $scope.col_name = [

        {field: "childname", displayName: "姓名"},
        {field: "positions", displayName: "职务"},
        {field: "phoneNumber", displayName: "手机"},
        {field: "telephone", displayName: "办公电话"},
        {field: "note", displayName: "备注"},
        {
            field: "",
            displayName: "",
            cellTemplate: '' +

            //部门
            '<button title="新建" class="btn btn-xs btn-primary "  ng-click="cellTemplateScope.add(row.branch)" ng-if=row.branch.type=="department"><li class="glyphicon glyphicon-plus"></li></button>\n' +
            '<button title="编辑" class="btn btn-xs btn-success"  ng-click="cellTemplateScope.edit(row.branch)" ng-if=row.branch.type=="department"><li class=" glyphicon glyphicon-pencil"></li></button>\n' +
            '<button title="删除"  class="btn btn-xs btn-danger " ng-click="cellTemplateScope.del(row.branch)" ng-if=row.branch.type=="department"><li class="glyphicon glyphicon-trash"></li></button>\n' +


            //人员
            '<button title="编辑" class="btn btn-xs btn-success "  ng-click="cellTemplateScope.edit(row.branch)" ng-if=row.branch.type=="person"><li class="glyphicon glyphicon-pencil"></li></button>\n' +
            '<button title="删除" class="btn btn-xs btn-danger " ng-click="cellTemplateScope.del(row.branch)" ng-if=row.branch.type=="person"><li class="glyphicon glyphicon-trash"></li></button>\n' +

            //公司
            '<button title="编辑" class="btn btn-xs btn-success "  ng-click="cellTemplateScope.add(row.branch)" ng-if=row.branch.type=="company"><li class="glyphicon glyphicon-plus"></li></button>\n',

            cellTemplateScope: {
                add: function (data) {         // this works too: $scope.someMethod;
                    console.log(data);
                    console.log("新建");
                    $("#treeAdd").modal("show");

                    $scope.treeEdit='';
                    $scope.treeNumber = $scope.tree_data.indexOf(data);
                },
                edit: function (data) {         // this works too: $scope.someMethod;
                    console.log(data);
                    console.log('修改');
                    $("#treeEdit").modal("show");
                    $scope.treeEdit=data;
                    $scope.treeCopyRowData=angular.copy(data)

                },
                del: function (data) {         // this works too: $scope.someMethod;
                    console.log(data);
                    console.log("删除");


                    //信息框-例2
                    layer.msg('确定删除吗？', {
                        time: 0 //不自动关闭
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            layer.close(index);

                            data.action='del'

                            //删除数据, 返回一级数据
                            lh_ajax.get({
                                url: 'server_json/tree3.json',
                                data: data,
                                success: function (msg) {
                                    console.log(msg.data)
                                    $scope.tree_data=msg.data
                                }
                            });


                        }
                    });

                }
            }
        }

    ];


    //编辑树
    $scope.clickTreeEditBtn=function (row) {
        console.log(row)

        lh_ajax.get({
            url: 'server_json/tree1.json',
            data: {id: 1},
            infoShow:true,
            success: function (msg) {
                $scope.treeEdit=row;
                $("#treeEdit").modal("hide");
            }
        });
    };
    //还原树
    $scope.clickTreeEditClose=function (row) {
        console.log("还原")
        var rowNumber = $scope.tree_data.indexOf(row);
        $scope.tree_data[rowNumber]= $scope.treeCopyRowData; //使用copy数据还原

    };


    //树增加children
    $scope.clickTreeAddBtn=function (row) {
        console.log(row)
        row.type="person";
        row.action='add';
        //像数据库发送数据, 然后只返回子节点数据
        lh_ajax.get({
            url: 'server_json/tree3.json',
            data: row,
            success: function (msg) {
                $scope.tree_data[$scope.treeNumber].children = msg.data;
                $("#treeAdd").modal("hide");
            }
        });

      
    };

}]);