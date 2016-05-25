var myApp = angular.module('myApp', [

    'jp.ng-bs-animated-button',
    "ngSanitize", // 输出html
    "w5c.validator",
    "ui.select", // 下拉菜单
    'gantt',
    'gantt.table',
    'gantt.movable',
    'gantt.tooltips',
    'gantt.drawtask',
    'mgcrea.ngStrap'
]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);

//表单验证配置
myApp.config(["w5cValidatorProvider", function (w5cValidatorProvider) {

    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: true,
        removeError: true

    });

    w5cValidatorProvider.setRules({});
}]);
//filter 过滤器 下拉菜单
myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


//时间格式化 timeFormat:'YYYY年MM月DD日 DD=星期,必须大写星期才能输出正确 H:mm:ss'
myApp.filter("timeFormat", [function () {
    return function (input, str) {
        return moment(input).format(str)
    }

}]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {





        //初始化 变量
        $scope.data = ''; //gantt图数据
        $scope.options = ''; //gantt图配置
        $scope.dataQuery = ''; //切换时间规模事件
        $scope.timeType = '';   //切换时间规模 选择按钮

        $scope.todays = store.get("o") ? moment(store.get("o").timeSpans.from) : new Date();  //获取今天日期


        $scope.timeSpans = ''; //声明时间跨度
        $scope.userType = $("#userType").val(); //声明用户类型


        //给时间跨度设置默认的开始时间和结束时间
        $scope.timeSpans = {
            from: store.get("o") ? moment(store.get("o").timeSpans.from) : $scope.todays,  //获取今天日期
            to: store.get("o") ? moment(store.get("o").timeSpans.to) : $scope.todays  //获取今天日期
        };

        // $scope.timeSpans = {
        //     from: moment(store.get("o").timeSpans.from),  //获取今天日期
        //     to: moment(store.get("o").timeSpans.to)  //获取今天日期
        // };



        // var taskUrl = "/proxy/127.0.0.1:1337"; //连接测试服务器
        // var taskUrl = "/proxy/192.168.1.136:8080/myportal/control/findMyTask"; //连接测试服务器
        var taskUrl = "server_json/person/month.json"; //连接默认数据

        //ajax方法, 用于获取服务器数据
        $scope.ajax = function (o, fn) {
            //o={
            //    timeScale:"", //时间规模 ,控制 年 月  日  周 的数据范围加载
            //    userType:"",  //用户类型
            //    timeSpans:{from:"开始",to:"结束"} //时间间隔
            //    data:"给服务器发送的 数据,"
            //     action:"del" 或者 "updtae" 删除 或者修改稿的操作
            //};
            //console.log(o);


            lh_ajax.get({
                url: taskUrl,
                data: o,
                infoShow: false,
                success: function (msg) {
                    $scope.data = msg.data;
                    $scope.dataQuery(store.get("o"));
                    console.log($scope.data);
                    if (fn) {
                        fn(msg)
                    }
                }
            });

        };


        //才操作提示的 ajax 主要用  删除修改
        $scope.ajaxInfo = function (o,info, fn) {
            //o={
            //    timeScale:"", //时间规模 ,控制 年 月  日  周 的数据范围加载
            //    userType:"",  //用户类型
            //    timeSpans:{from:"开始",to:"结束"} //时间间隔
            //    data:"给服务器发送的 数据,"
            //      action:"del" 或者 "updtae" 删除 或者修改稿的操作
            //};
            // info =  true  : false  用于控制提示是否出现
            console.log(o);



            lh_ajax.get({
                url: taskUrl,
                data: o,
                infoShow:info,
                success: function (msg) {
                    //console.log("啊上的发上的");


                    if (fn) {
                        fn(msg)
                    }
                }
            });
        };




        //把当前的所有参数都写进 本地缓存
        $scope.setStore = function (o) {
            store.set("o", o);
        };

        //向本地缓存写入数据, 然后在获取数据
        $scope.setStoreAjax = function (o) {

            async.series([
                    function (callback) {


                        $scope.dataQuery(o);


                        callback(null)


                    }],
                function (err, result) {
                    $scope.ajax(store.get("o"));


                });
        };


        // console.log(store.get("o").timeScale)
        // $.cookie('scale')?$.cookie('scale') : 'day', //默认显示时间规模
        $scope.options = {

            scale: store.get("o") ? store.get("o").timeScale : "day", //默认显示时间规模
            labelsEnabled: true, //是否显示侧边
            daily: false, //每日
            draw: false,
            readOnly: false,
            zoom: undefined,
            getToday: '',
            headers: undefined,
            width: false,
            drawTaskFactory: function () { //直接增加任务进度的地方
                return {
                    //id: utils.randomUuid(),  // Unique id of the task.
                    name: '新任务', // Name shown on top of each task.
                    color: '#AA8833', // Color of the task in HEX format (Optional).
                    //from:"",
                    //to:"",
                };
            },


            api: function (api) {
                $scope.api = api; //把事件传给 gantt图


                //初始化事件
                api.core.on.ready($scope, function () {


                    if (api.tasks.on.moveBegin) {

                        //任务缩放的时候运行
                        api.tasks.on.resize($scope, function (e, dask) {
                            //$scope.rowEdit = dask;
                            $scope.$broadcast("to-editTask", dask);

                        });
                    }

                    //给节点绑定事件
                    api.directives.on.new($scope, function (directiveName, directiveScope, element, dAttrs, dController) {

                        //判断 现在是否运行了 ganttTask 任务
                        if (directiveName === 'ganttTask') {


                            //绑定一个双击事件
                            element.bind('dblclick', function (event) {
                                event.stopPropagation();


                                //logTaskEvent('task-click', directiveScope.task);
                                $scope.$broadcast("to-editTask", directiveScope.task);
                            });


                        }


                    });


                })
            }
        };


        //返回当天按钮事件
        $scope.todayClick = function () {
            async.series([
                    function (callback) {

                        $scope.timeSpans = {
                            from: moment(new Date()),
                            to: moment(new Date())
                        };

                        $scope.dataQuery({
                            timeScale: 'day',
                            timeSpans: $scope.timeSpans,
                            userType: $scope.userType,
                            from: moment(new Date()).format("YYYY-MM-DD H:mm:ss"),
                            to: moment(new Date()).format("YYYY-MM-DD H:mm:ss")
                        });
                        callback(null)
                    }],
                function (err, result) {


                    window.location.reload()

                });
        };


    
        //日期查询按钮事件
        $scope.dataQueryClick = function () {



            var from = moment($scope.timeSpans.from).unix();
            var to = moment($scope.timeSpans.to).unix();





            //判断起始时间是否大于结束时间
            if (from > to) {
                layer.msg("起始时间不能大于结束时间");
            } else {



                async.series([
                        function (callback) {

                            //判断是否显示月视图
                            if((to - from )>604800){
                                $scope.options.scale='month';

                            }


                            $scope.timeSpans={
                                from:$scope.timeSpans.from,
                                to:$scope.timeSpans.to
                            };

                            $scope.dataQuery({
                                timeScale: $scope.options.scale,//获取当前选择的时间规模
                                timeSpans: $scope.timeSpans,
                                userType: $scope.userType,
                                from: moment($scope.timeSpans.from).format("YYYY-MM-DD H:mm:ss"),
                                to: moment($scope.timeSpans.to).format("YYYY-MM-DD H:mm:ss"),
                            });
                            callback(null)
                        }],
                    function (err, result) {


                        window.location.reload()

                    }
                );

            }
            //console.log(from + "----" + to);

        };


        //时间规模切换 ,和 前进 后退 时间选择
        $scope.timeType = {
            updatedTime: $scope.todays, //更新以后的时间
            data: [
                {"value": "year", "name": "年视图"},
                {"value": "month", "name": "月视图"},
                {"value": "week", "name": "周视图"},
                {"value": "day", "name": "天视图"}
            ],
            queryClick: function (row) {
                console.log(row);
                $scope.options.scale = row.value;

                async.series([
                        function (callback) {
                            $scope.dataQuery({
                                timeScale: row.value,
                                timeSpans: $scope.timeSpans,
                                userType: $scope.userType,
                                from: moment($scope.todays).format("YYYY-MM-DD H:mm:ss"),
                                to: moment($scope.todays).format("YYYY-MM-DD H:mm:ss")
                            });
                            callback(null)
                        }],
                    function (err, result) {


                        window.location.reload()

                    }
                );


            },


            upClick: function (o) {

                console.log("上" + o);
                var thisTimeType = $scope.timeType;
                var scale = $scope.options.scale; //获取当前选择的时间规模

                //日期往前
                thisTimeType.updatedTime = moment(thisTimeType.updatedTime).subtract(1, scale);


                $scope.timeSpans = {
                    from: moment(thisTimeType.updatedTime),
                    to: moment(thisTimeType.updatedTime)
                };
                async.series([
                        function (callback) {
                            $scope.dataQuery({
                                timeScale: scale,
                                timeSpans: $scope.timeSpans,
                                userType: $scope.userType,
                                from: moment(thisTimeType.updatedTime).format("YYYY-MM-DD H:mm:ss"),
                                to: moment(thisTimeType.updatedTime).format("YYYY-MM-DD H:mm:ss")
                            });
                            callback(null)
                        }],
                    function (err, result) {


                        window.location.reload()

                    });

            },
            lowClick: function (o) {

                console.log("下" + o);
                var thisTimeType = $scope.timeType;
                var scale = $scope.options.scale; //获取当前选择的时间规模

                //日期往后
                thisTimeType.updatedTime = moment(thisTimeType.updatedTime).add(1, scale);


                $scope.timeSpans = {
                    from: moment(thisTimeType.updatedTime),
                    to: moment(thisTimeType.updatedTime)
                };


                async.series([
                        //往本地缓存写入数据
                        function (callback) {
                            $scope.dataQuery({
                                timeScale: scale,
                                timeSpans: $scope.timeSpans,
                                userType: $scope.userType,
                                from: moment(thisTimeType.updatedTime).format("YYYY-MM-DD H:mm:ss"),
                                to: moment(thisTimeType.updatedTime).format("YYYY-MM-DD H:mm:ss")
                            });
                            callback(null)
                        }],
                    function (err, result) {

                        //刷新当前页面
                        window.location.reload()


                    }
                );

            }
        };


        //时间规模切换,并且发送到服务器来获取当前规模的 数据
        $scope.dataQuery = function (o, fn) {

            switch (o.timeScale) {
                //case "hour":
                //    $scope.ajax({type: newVal});
                //    $scope.options.headers = ['hour'];
                //    break;
                case "day":
                    $scope.timeType.up = "上一天";
                    $scope.timeType.low = "下一天";
                    $scope.timeType.queryScale = '天视图';
                    $scope.options.headers = ['hour'];
                    $scope.setStore(o);
                    if ($scope.data.length <= 0) {

                        $scope.data = [
                            {
                                "name": "任务",
                                "content": "任务",
                                "classes": "gantt-row-milestone",
                                "tasks": [
                                    {
                                        "name": "当前没有任务",
                                        "color": "#fff",
                                        "from": "2018-01-01T00:00:00",
                                        "to": "2018-01-01T23:59:00",
                                        "data": ""
                                    }
                                ]
                            }
                        ];
                    }
                    break;
                case "week":
                    $scope.options.headers = ['day'];
                    $scope.timeType.up = "上一周";
                    $scope.timeType.low = "下一周";
                    $scope.timeType.queryScale = '周视图';

                    $scope.setStore(o);
                    if ($scope.data.length <= 0) {

                        $scope.data = [
                            {
                                "name": "任务",
                                "content": "任务",
                                "classes": "gantt-row-milestone",
                                "tasks": [
                                    {
                                        "name": "当前没有任务",
                                        "color": "#fff",
                                        "from": "2016-05-23T00:00:00",
                                        "to": "2016-05-29T23:00:00",

                                    }
                                ]
                            }
                        ];
                    }
                    break;

                case "month":

                    $scope.options.headers = ['day'];
                    $scope.timeType.up = "上一月";
                    $scope.timeType.low = "下一月";

                    $scope.timeType.queryScale = '月视图';
                    $scope.setStore(o);

                    console.log($scope.data.length)
                    if ($scope.data.length <= 0) {

                        $scope.data = [
                            {
                                "name": "任务",
                                "content": "任务",
                                "classes": "gantt-row-milestone",
                                "tasks": [
                                    {
                                        "name": "当前没有任务",
                                        "color": "#fff",
                                        "from": "2018-12-01T00:00:00",
                                        "to": "2018-12-31T23:00:00",

                                    }
                                ]
                            }
                        ];
                    }


                    break;
                case "year":
                    $scope.options.headers = ['month'];
                    $scope.timeType.up = "上一年";
                    $scope.timeType.low = "下一年";
                    $scope.timeType.queryScale = '年视图';
                    $scope.setStore(o);
                    if ($scope.data.length <= 0) {

                        $scope.data = [
                            {
                                "name": "任务",
                                "content": "任务",
                                "classes": "gantt-row-milestone",
                                "tasks": [
                                    {
                                        "name": "当前没有任务",
                                        "color": "#fff",
                                        "from": "2018-01-01T00:00:00",
                                        "to": "2018-12-31T23:00:00",
                                        "data": ""
                                    }
                                ]
                            }
                        ];
                    }
                    break;
                default :
                    $scope.options.headers = ['hour'];
                    $scope.timeType.up = "上一天";
                    $scope.timeType.low = "下一天";
                    $scope.setStore(o);
                    console.log("data" + $scope.options.headers)
            }
        };


        //页面第一次加载的时候 ,运行这个
        $scope.setStoreAjax({
            timeScale: $scope.options.scale,
            timeSpans: $scope.timeSpans,
            userType: $scope.userType,
            from: moment($scope.timeSpans.from).format("YYYY-MM-DD H:mm:ss"),
            to: moment($scope.timeSpans.to).format("YYYY-MM-DD H:mm:ss"),
        });
        //加载颜色列表
        $scope.colorList='';
        lh_ajax.get({
            url: 'server_json/color_list.json',
            success: function (msg) {
                //console.log("啊上的发上的");
                //颜色下拉菜单
                $scope.colorList = msg.data;
            }
        });



        //创建任务按钮
        $scope.addTaskClick = function () {
            $scope.$broadcast("to-addTask", $scope.timeSpans);
        }
    }]);


//编辑任务
myApp.controller('editTask',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {


        $scope.editFrom = {};
        $scope.$on('to-editTask', function (e, task) {



            $scope.rowEdit = task;

            $scope.editFrom = {
                name: task.model.name,
                from: task.model.from, //开始时间
                to:     task.model.to, //结束时间
                color: task.model.color,
                id: task.model.id
            };

            console.log($scope.editFrom )

            $("#editTask").modal("show");

        });


        //删除任务
        $scope.delClick = function () {
            //对话框
            layer.msg('你要删除当前任务吗？', {
                time: 0, //不自动关闭
                btn: ['确认删除', '不删除'],
                yes: function (index) {
                    layer.close(index);

                    $scope.rowEdit.model.action="del";
                    //给服务器发消息删除
                    $scope.ajaxInfo($scope.rowEdit.model,true);




                    $("#editTask").modal("hide");
                    $scope.$emit('to-rootController', $scope.rowEdit);
                }
            });
        };


        //点击修改任务按钮
        $scope.editClick = function () {
            console.log("修改")
            //$scope.rowEdit 这个值在主控制器里已经声明过了
            $scope.rowEdit.model.name = $scope.editFrom.name;
            $scope.rowEdit.model.from = moment($scope.editFrom.from);
            $scope.rowEdit.model.to = moment($scope.editFrom.to);
            // $scope.rowEdit.model.to = "2016-04-06 20:00:00";
            $scope.rowEdit.model.color = $scope.editFrom.color;

            //动作
            $scope.rowEdit.model.action = "update";


            //给ajax发送数据, copy一份数据到新的内存, 然后修改里面的 from to 时间格式
            var ajaxRowEdit=angular.copy($scope.rowEdit.model);
            ajaxRowEdit.from=moment($scope.editFrom.from).format("YYYY-MM-DD H:mm:ss");
            ajaxRowEdit.to = moment($scope.editFrom.to).format("YYYY-MM-DD H:mm:ss");

            //给服务器发消息修改
            $scope.ajaxInfo(ajaxRowEdit,true);

            //发消息给主控制器
            $scope.$emit('to-rootController', $scope.rowEdit.model);
            $("#editTask").modal("hide");


        };

    }]);


//创建任务
myApp.controller('addTask',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

        $scope.editFrom = {}
        $scope.$on('to-addTask', function (e, timeSpans) {

            console.log(timeSpans);
            $("#addTask").modal("show");
            $scope.editFrom = {
                from: timeSpans.from,
                to: timeSpans.to,

            }


        });


        //点击修改任务按钮
        $scope.editClick = function () {
            $scope.rowEdit = {};
            //$scope.rowEdit 这个值在主控制器里已经声明过了
            $scope.rowEdit.name = $scope.editFrom.name;
            $scope.rowEdit.from = moment($scope.editFrom.from).format("YYYY-MM-DD H:mm:ss");
            $scope.rowEdit.to = moment($scope.editFrom.to).format("YYYY-MM-DD H:mm:ss");
            $scope.rowEdit.color = $scope.editFrom.selected.value.color;


            $scope.rowEdit.action =  "add";
            console.log($scope.rowEdit)

            //给服务器发消息修改
            $scope.ajaxInfo($scope.rowEdit,true);

            // console.log($scope.rowEdit)

            //发消息给主控制器
            $scope.$emit('to-rootController', $scope.rowEdit);
            $("#addTask").modal("hide");


        };

    }]);