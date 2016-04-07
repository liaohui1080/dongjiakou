var myApp = angular.module('myApp', [
    "angular-loading-bar", //加载进度条=
    'ngNotify',//弹出提示
    "ngSanitize", // 输出html
    'jp.ng-bs-animated-button',
    'gantt',
    'gantt.table',
    'gantt.movable',
    'gantt.tooltips',
    'gantt.drawtask',
    'mgcrea.ngStrap'
]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false); // Remove debug info (angularJS >= 1.3)
}]);

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

        console.log("日历");


        $scope.live = {};

        var taskUrl = "/proxy/127.0.0.1:1337";
        //var taskUrl = "server_json/person.json";

        //控制btn加载状态
        $scope.isSubmitting = null;
        $scope.result = null;


        //从服务器获取数据
        $scope.data = []; //填充给 日历
        $scope.ajax = function (o, fn) {
            //o={
            //    timeScale:"", //时间规模 ,控制 年 月  日  周 的数据范围加载
            //    userType:"",  //用户类型
            //    timeSpans:{from:"开始",to:"结束"} //时间间隔
            //};
            //console.log(o);
            lh_ajax.get({
                url: taskUrl,
                data: o,
                success: function (msg) {
                    //console.log("啊上的发上的");
                    $scope.data = msg.data;

                    if (fn) {
                        fn(msg)
                    }
                }
            });
        };


        //获取今天日期
        $scope.today = new Date();
        //$scope.rowEdit = {}; //初始化任务行内容
        $scope.timeSpans = null; //声明时间跨度
        $scope.userType = $("#userType").val(); //声明用户类型

        //给时间跨度设置默认的开始时间和结束时间
        $scope.timeSpans = {
            from: $scope.today,
            to: $scope.today
        };


        //日期查询按钮
        $scope.dataQueryBtn = {
            buttonDefaultClass: 'btn-primary btn-sm', //默认状态
            buttonSubmittingClass: 'btn-primary btn-sm', // 加载状态
            buttonDefaultText: '查询', //默认文字
            buttonSubmittingText: ".", //加载文字
            buttonSuccessText: ".",  //成功文字
            buttonErrorText: "起始时间不能大于结束时间",  //成功文字
            buttonSuccessClass: 'btn-success btn-sm' //成功状态

        };

        //返回今天的任务计划
        $scope.todayClick = function () {
            $scope.isSubmitting = true;
            var scale = $scope.options.scale; //获取当前选择的时间规模

            var from = moment($scope.timeSpans.from).unix();
            var to = moment($scope.timeSpans.to).unix();

            //判断起始时间是否大于结束时间
            if (from > to) {
                //alert("起始时间不能大于结束时间")
                $scope.result = 'error';
            } else {

                $scope.ajax({timeScale: scale, timeSpans: $scope.timeSpans, userType: $scope.userType}, function () {
                    $scope.result = 'success';
                });
            }
            console.log(from + "----" + to);

        };


        $scope.taskAddClick = function () {
            $scope.$broadcast("to-addTask", $scope.timeSpans);
        };

        //时间跨度, 在这个跨度之内只显示背景色, 可以用来标注节假日,或者特殊日子
        //$scope.timespans = [
        //    {
        //        from: new Date(2013, 9, 7, 0, 0, 0),
        //        to: new Date(2013, 9, 7, 0, 0, 0),
        //        name: 'Sprint 1 Timespan'
        //        //priority: undefined,
        //        //classes: [],
        //        //data: undefined
        //    }
        //];

        $scope.options = {};
        $scope.options = {

            scale: 'day', //默认显示时间规模
            labelsEnabled: true, //是否显示侧边
            daily: false, //每日
            draw: false,
            readOnly: false,
            zoom: undefined,
            //headers: undefined,
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

            //drawTaskFactory: function (o) { //直接增加任务进度的地方
            //    console.log(o)
            //    return {
            //        name: o.name,
            //        color: o.color,
            //        from: o.from,
            //        to: o.to
            //    };
            //},

            api: function (api) {
                $scope.api = api;
                api.core.on.ready($scope, function () {

                    //api.tasks.on.change($scope, addEventName('tasks.on.change', logTaskEvent));
                    //api.tasks.on.add($scope, addEventName('tasks.on.add', logTaskEvent));
                    //api.tasks.on.rowChange($scope, addEventName('tasks.on.rowChange', logTaskEvent));
                    api.tasks.on.remove($scope, addEventName('tasks.on.remove', function (e, dask) {
                        //$scope.rowEdit = dask;
                        console.log(dask)

                    }));

                    if (api.tasks.on.moveBegin) {
                        //api.tasks.on.moveBegin($scope, addEventName('tasks.on.moveBegin', logTaskEvent));
                        //api.tasks.on.move($scope, addEventName('tasks.on.move', logTaskEvent));
                        //api.tasks.on.moveEnd($scope, addEventName('tasks.on.moveEnd', logTaskEvent));

                        //api.tasks.on.resizeBegin($scope, addEventName('tasks.on.resizeBegin', logTaskEvent));
                        //api.tasks.on.resize($scope, addEventName('tasks.on.resize', logTaskEvent));
                        //api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resizeEnd', logTaskEvent));
                        //console.log($scope)
                        api.tasks.on.resize($scope, addEventName('tasks.on.resize', function (e, dask) {
                            //$scope.rowEdit = dask;
                            $scope.$broadcast("to-editTask", dask);

                        }));

                        //api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resize', function (e, dask) {
                        //    $scope.rowEdit = dask;
                        //    $scope.$broadcast("to-editTask", dask);
                        //
                        //}));
                    }


                    api.directives.on.new($scope, function (directiveName, directiveScope, element, dAttrs, dController) {
                        if (directiveName === 'ganttTask') {


                            element.bind('dblclick', function (event) {
                                event.stopPropagation();


                                //logTaskEvent('task-click', directiveScope.task);
                                $scope.$broadcast("to-editTask", directiveScope.task);
                            });

                            element.bind('click', function (event) {
                                event.stopPropagation();

                                console.log("删除")
                                //logTaskEvent('task-click', directiveScope.task);
                                //$scope.$broadcast("to-editTask", directiveScope.task);
                            });

                        }

                        if (directiveName === 'ganttRowLabel') {
                            element.bind('dblclick', function (event) {
                                event.stopPropagation();

                                $scope.$broadcast("to-addTask", directiveScope.row);
                                //logRowEvent('row-click', directiveScope.row);
                            });

                            element.bind('mousedown touchstart', function(event) {
                                event.stopPropagation();
                                $scope.live.row = directiveScope.row.model;
                                $scope.$digest();
                                $scope.$broadcast("to-addTask", directiveScope.row);
                            });

                        }
                    });


                })
            }
        };


        //当前显示规模切换
        $scope.timeType = {};

        $scope.timeType = {
            updatedTime: $scope.today, //更新以后的时间
            data: [
                {"value": "year", "name": "当年"},
                {"value": "month", "name": "当月"},
                {"value": "week", "name": "当周"},
                {"value": "day", "name": "今天"}
            ],
            upClick: function (o) {
                console.log("上" + o);
                var scale = $scope.options.scale; //获取当前选择的时间规模


                this.updatedTime = moment(this.updatedTime).subtract(1, scale);

                $scope.timeSpans = {
                    from: this.updatedTime,
                    to: this.updatedTime
                };

                $scope.dataQuery({timeScale: scale, timeSpans: $scope.timeSpans, userType: $scope.userType});
                //console.log(this.updatedTime);

            },
            lowClick: function (o) {
                console.log("下" + o);
                var scale = $scope.options.scale; //获取当前选择的时间规模

                this.updatedTime = moment(this.updatedTime).add(1, scale);

                $scope.timeSpans = {
                    from: this.updatedTime,
                    to: this.updatedTime
                };

                $scope.dataQuery({timeScale: scale, timeSpans: $scope.timeSpans, userType: $scope.userType});
                // console.log(this.updatedTime);

            }
        };


        //控制当前日历显示规模
        var scaleWacth = $scope.$watch('options.scale', function (newVal, oleVal, scope) {
            console.log(newVal);
            console.log(oleVal)

            //在切换的时候,给日历默认数据,以防止在 年 切换到 天的时候,出现数据挤在一块的问题
            $scope.data = [
                {
                    "name": "任务",
                    "content": "任务",
                    "classes": "gantt-row-milestone",
                    "tasks": [
                        {
                            "name": "任务1",
                            "color": "#93C47D",
                            "from": "2018-10-06T00:00:00",
                            "to": "2018-10-06T04:00:00",
                            "data": ""
                        }
                    ]
                }
            ];

            $scope.dataQuery({timeScale: newVal, timeSpans: $scope.timeSpans, userType: $scope.userType})

        });


        //时间规模切换,并且发送到服务器来获取当前规模的 数据
        $scope.dataQuery = function (o) {

            switch (o.timeScale) {
                //case "hour":
                //    $scope.ajax({type: newVal});
                //    $scope.options.headers = ['hour'];
                //    break;
                case "day":

                    $scope.timeType.up = "上一天";
                    $scope.timeType.low = "下一天";


                    $scope.options.headers = ['hour'];
                    $scope.ajax(o);

                    break;
                case "week":
                    $scope.options.headers = ['day'];
                    $scope.timeType.up = "上一周";
                    $scope.timeType.low = "下一周";
                    $scope.ajax(o);

                    break;
                case "month":
                    $scope.options.headers = ['day'];
                    $scope.timeType.up = "上一月";
                    $scope.timeType.low = "下一月";
                    $scope.ajax(o);

                    break;
                case "year":
                    $scope.options.headers = ['month'];
                    $scope.timeType.up = "上一年";
                    $scope.timeType.low = "下一年";
                    $scope.ajax(o);

                    break;
                default :
                    $scope.options.headers = ['hour'];
                    $scope.timeType.up = "上一天";
                    $scope.timeType.low = "下一天";
                    $scope.ajax(o);
            }
        };


        // Event handler
        function logTaskEvent(eventName, task) {
            console.log('[Event] ' + eventName + ': ' + task.model.name);


            console.log(task);
            //$scope.editFrom={};

            //$scope.editFrom = {
            //    name: task.model.name,
            //    from: task.model.from, //开始时间
            //    to: task.model.to, //结束时间
            //    color: task.model.color
            //};

            //$scope.rowEdit=task.model;
            $scope.editFrom = {};
            $scope.editFrom = task.model;
            //$scope.editFrom.id=task.row.model.id;
            //console.log(task.row.model)
            //console.log(task.model)
            $("#editTask").modal("show");


            //点击修改任务按钮
            $scope.editClick = function () {

                //$scope.rowEdit 这个值在主控制器里已经声明过了
                //$scope.rowEdit.model.name = $scope.editFrom.name;
                //$scope.rowEdit.model.from = moment($scope.editFrom.from);
                //$scope.rowEdit.model.to = moment($scope.editFrom.to);
                //$scope.rowEdit.model.color = $scope.editFrom.color;


                //$scope.rowEdit.name = $scope.editFrom.name;
                //$scope.rowEdit.from = moment($scope.editFrom.from);
                //$scope.rowEdit.to = moment($scope.editFrom.to);
                //$scope.rowEdit.color = $scope.editFrom.color;
                //发消息给主控制器
                //$scope.$emit('to-rootController', $scope.rowEdit);
                $("#editTask").modal("hide");


            };

        };

        //
        //var logTaskEvent2 = function (eventName, task) {
        //    console.log('[Event] ' + eventName + ': ' + task.model.name);
        //    //$scope.live.taskJson = angular.toJson(task.model, true);
        //    //$scope.live.rowJson = angular.toJson(task.row.model, true);
        //    //
        //    //
        //    $("#editTime").modal("show");
        //    $scope.rowEdit = task.model;
        //    $scope.editFrom = {
        //        taskName: task.model.name,
        //        taskFrom: task.model.from, //开始时间
        //        taskTo: task.model.to, //结束时间
        //        taskColor: task.model.color
        //    };
        //
        //
        //    // console.log(task.model.from)
        //};

        $scope.$on('to-rootController', function (e, task) {
            console.log(task)
            $scope.rowEdit = task;
        });


        $scope.$on('to-addTesk', function (e, task) {
            console.log(task)
            //$scope.options.draw=true;
            //$scope.options.drawTaskFactory(task);
            $scope.rowEdit = task;
        });


        // Event utility function //显示事件名字
        var addEventName = function (eventName, func) {
            return function (data) {
                return func(eventName, data);
            };
        };


    }]);


//编辑任务
myApp.controller('editTask',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

        $scope.$on('to-editTask', function (e, task) {

            console.log(task.model);
            console.log(task);


            $scope.editFrom = {};
            $scope.rowEdit = task;

            $scope.editFrom = {
                name: task.model.name,
                from: task.model.from, //开始时间
                to: task.model.to, //结束时间
                color: task.model.color,
                id:  task.model.id
            };

            $("#editTask").modal("show");

        });


        $scope.close = function (id) {

            console.log($scope.rowEdit.row.tasks)
            console.log($scope.rowEdit.model)
            $scope.rowEdit.model = [];
            console.log($scope.rowEdit.model)
        };

        //点击修改任务按钮
        $scope.editClick = function () {

            //$scope.rowEdit 这个值在主控制器里已经声明过了
            $scope.rowEdit.model.name = $scope.editFrom.name;
            $scope.rowEdit.model.from = moment($scope.editFrom.from);
            $scope.rowEdit.model.to = moment($scope.editFrom.to);
            $scope.rowEdit.model.color = $scope.editFrom.color;

            //发消息给主控制器
            $scope.$emit('to-rootController', $scope.rowEdit);
            $("#editTask").modal("hide");


        };

    }]);


//创建任务
myApp.controller('addTask',
    ['$scope', '$log', 'lh_ajax', '$timeout', function ($scope, $log, lh_ajax, $timeout) {

        $scope.$on('to-addTask', function (e, task) {

            console.log(task);
            $("#addTask").modal("show");
            //var ss =$scope.editFrom;
            //ss={};


        });

        $scope.editFrom = {};

        //点击修改任务按钮
        $scope.editClick = function () {
            $scope.rowEdit = [];
            //$scope.rowEdit 这个值在主控制器里已经声明过了
            $scope.rowEdit.name = $scope.editFrom.name;
            $scope.rowEdit.from = moment($scope.editFrom.from);
            $scope.rowEdit.to = moment($scope.editFrom.to);
            $scope.rowEdit.color = $scope.editFrom.color;

            //发消息给主控制器
            $scope.$emit('to-addTesk', $scope.rowEdit);
            $("#addTask").modal("hide");


        };

    }]);