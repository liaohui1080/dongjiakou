var myApp = angular.module('myApp', [
    "angular-loading-bar", //加载进度条=
    'ngNotify' ,//弹出提示
    "ngSanitize", // 输出html
    'gantt',
    'gantt.table',
    'gantt.movable',
    'gantt.tooltips',
    'gantt.drawtask',
    'mgcrea.ngStrap'
]);


//进度条配置
//myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//    cfpLoadingBarProvider.includeSpinner = true;
//}]);


//filter 过滤器 下拉菜单
//myApp.filter("propsFilter", lhFilter.uiSelectPropsFilter);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务



myApp.controller('rootController',
    ['$scope', '$log','lh_ajax', function ($scope, $log,lh_ajax) {

        console.log("日历")



        var data = [
            // Order is optional. If not specified it will be assigned automatically
            {
                name: '名字',
                height: '3em',
                sortable: false,
                classes: 'gantt-row-milestone',
                color: '#45607D',
                tasks: [
                    // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
                    {
                        name: 'Kickoff',
                        //color: '#93C47D',
                        from: '2013-10-07T09:00:00',
                        to: '2013-10-07T10:00:00',
                        data: 'Can contain any custom data or object'
                    },
                    {
                        name: 'Concept approval',
                        color: '#93C47D',
                        from: new Date(2013, 9, 18, 18, 0, 0),
                        to: new Date(2013, 9, 18, 18, 0, 0),
                        est: new Date(2013, 9, 16, 7, 0, 0),
                        lct: new Date(2013, 9, 19, 0, 0, 0)
                    },
                    {
                        name: 'Development finished',
                        color: '#93C47D',
                        from: new Date(2013, 10, 15, 18, 0, 0),
                        to: new Date(2013, 10, 15, 18, 0, 0)
                    },
                    {
                        name: 'Shop is running',
                        color: '#93C47D',
                        from: new Date(2013, 10, 22, 12, 0, 0),
                        to: new Date(2013, 10, 22, 12, 0, 0)
                    },
                    {
                        name: 'Go-live',
                        color: '#93C47D',
                        from: new Date(2013, 10, 29, 16, 0, 0),
                        to: new Date(2013, 10, 29, 16, 0, 0)
                    }
                ],
                data: 'Can contain any custom data or object'
            },
            {
                name: 'Status meetings', tasks: [
                {
                    name: 'Demo #1',
                    color: '#9FC5F8',
                    from: new Date(2013, 9, 25, 15, 0, 0),
                    to: new Date(2013, 9, 25, 18, 30, 0)
                },
                {
                    name: 'Demo #2',
                    color: '#9FC5F8',
                    from: new Date(2013, 10, 1, 15, 0, 0),
                    to: new Date(2013, 10, 1, 18, 0, 0)
                },
                {
                    name: 'Demo #3',
                    color: '#9FC5F8',
                    from: new Date(2013, 10, 8, 15, 0, 0),
                    to: new Date(2013, 10, 8, 18, 0, 0)
                },
                {
                    name: 'Demo #4',
                    color: '#9FC5F8',
                    from: new Date(2013, 10, 15, 15, 0, 0),
                    to: new Date(2013, 10, 15, 18, 0, 0)
                },
                {
                    name: 'Demo #5',
                    color: '#9FC5F8',
                    from: new Date(2013, 10, 24, 9, 0, 0),
                    to: new Date(2013, 10, 24, 10, 0, 0)
                }
            ]
            },
            {
                name: 'Kickoff', movable: {allowResizing: false}, tasks: [
                {
                    name: 'Day 1',
                    color: '#9FC5F8',
                    from: new Date(2013, 9, 7, 9, 0, 0),
                    to: new Date(2013, 9, 7, 17, 0, 0),
                    progress: {percent: 100, color: '#3C8CF8'},
                    movable: false
                },
                {
                    name: 'Day 2',
                    color: '#9FC5F8',
                    from: new Date(2013, 9, 8, 9, 0, 0),
                    to: new Date(2013, 9, 8, 17, 0, 0),
                    progress: {percent: 100, color: '#3C8CF8'}
                },
                {
                    name: 'Day 3',
                    color: '#9FC5F8',
                    from: new Date(2013, 9, 9, 8, 30, 0),
                    to: new Date(2013, 9, 9, 12, 0, 0),
                    progress: {percent: 100, color: '#3C8CF8'}
                }
            ]
            },
            {
                name: 'Create concept', tasks: [
                {
                    name: 'Create concept',
                    priority: 20,
                    content: '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}',
                    color: '#F1C232',
                    from: new Date(2013, 9, 10, 8, 0, 0),
                    to: new Date(2013, 9, 16, 18, 0, 0),
                    est: new Date(2013, 9, 8, 8, 0, 0),
                    lct: new Date(2013, 9, 18, 20, 0, 0),
                    progress: 100
                }
            ]
            },
            {
                name: 'Finalize concept', tasks: [
                {
                    id: 'Finalize concept',
                    name: 'Finalize concept',
                    priority: 10,
                    color: '#F1C232',
                    from: new Date(2013, 9, 17, 8, 0, 0),
                    to: new Date(2013, 9, 18, 18, 0, 0),
                    progress: 100
                }
            ]
            },
            {
                name: 'Development',
                children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
                content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}'
            },
            {
                name: 'Sprint 1', tooltips: false, tasks: [
                {
                    id: 'Product list view',
                    name: 'Product list view',
                    color: '#F1C232',
                    from: new Date(2013, 9, 21, 8, 0, 0),
                    to: new Date(2013, 9, 25, 15, 0, 0),
                    progress: 25,
                    dependencies: [{to: 'Order basket'}, {from: 'Finalize concept'}]
                }
            ]
            },
            {
                name: 'Sprint 2', tasks: [
                {
                    id: 'Order basket',
                    name: 'Order basket',
                    color: '#F1C232',
                    from: new Date(2013, 9, 28, 8, 0, 0),
                    to: new Date(2013, 10, 1, 15, 0, 0),
                    dependencies: {to: 'Checkout'}
                }
            ]
            },
            {
                name: 'Sprint 3', tasks: [
                {
                    id: 'Checkout',
                    name: 'Checkout',
                    color: '#F1C232',
                    from: new Date(2013, 10, 4, 8, 0, 0),
                    to: new Date(2013, 10, 8, 15, 0, 0),
                    dependencies: {to: 'Login & Signup & Admin Views'}
                }
            ]
            },
            {
                name: 'Sprint 4', tasks: [
                {
                    id: 'Login & Signup & Admin Views',
                    name: 'Login & Signup & Admin Views',
                    color: '#F1C232',
                    from: new Date(2013, 10, 11, 8, 0, 0),
                    to: new Date(2013, 10, 15, 15, 0, 0),
                    dependencies: [{to: 'HW'}, {to: 'SW / DNS/ Backups'}]
                }
            ]
            },
            {name: 'Hosting'},
            {
                name: 'Setup', tasks: [
                {
                    id: 'HW',
                    name: 'HW',
                    color: '#F1C232',
                    from: new Date(2013, 10, 18, 8, 0, 0),
                    to: new Date(2013, 10, 18, 12, 0, 0)
                }
            ]
            },
            {
                name: 'Config', tasks: [
                {
                    id: 'SW / DNS/ Backups',
                    name: 'SW / DNS/ Backups',
                    color: '#F1C232',
                    from: new Date(2013, 10, 18, 12, 0, 0),
                    to: new Date(2013, 10, 21, 18, 0, 0)
                }
            ]
            },
            {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
            {
                name: 'Deployment', parent: 'Hosting', tasks: [
                {
                    name: 'Depl. & Final testing',
                    color: '#F1C232',
                    from: new Date(2013, 10, 21, 8, 0, 0),
                    to: new Date(2013, 10, 22, 12, 0, 0),
                    'classes': 'gantt-task-deployment'
                }
            ]
            },
            {
                name: 'Workshop', tasks: [
                {
                    name: 'On-side education',
                    color: '#F1C232',
                    from: new Date(2013, 10, 24, 9, 0, 0),
                    to: new Date(2013, 10, 25, 15, 0, 0)
                }
            ]
            },
            {
                name: 'Content', tasks: [
                {
                    name: 'Supervise content creation',
                    color: '#F1C232',
                    from: new Date(2013, 10, 26, 9, 0, 0),
                    to: new Date(2013, 10, 29, 16, 0, 0)
                }
            ]
            },
            {
                name: 'Documentation', tasks: [
                {
                    name: 'Technical/User documentation',
                    color: '#F1C232',
                    from: new Date(2013, 10, 26, 8, 0, 0),
                    to: new Date(2013, 10, 28, 18, 0, 0)
                }
            ]
            }
        ];

        $scope.getToday = new Date();

        $scope.headersFormats = {
            'year': 'YYYY',
            'quarter': '[Q]Q YYYY',
            month: 'MMMM YYYY',
            week: 'w',
            day: 'D',
            hour: 'H',
            minute: 'HH:mm'
        };
        var data2 = [

            {
                "name": "Setup",
                "id": "1",

                "tasks": [
                    {
                        "id": "1",
                        "name": "是案件",
                        "color": "#F1C232",
                        from: "2013-10-09T00:30:00.000Z",
                        to: "2013-10-09T00:30:00.000Z",
                    },
                    {
                        "id": "2",
                        "name": "是案件",
                        "color": "#FF9766",
                        from: "2013-10-09T01:30:00.000Z",
                        to: "2013-10-09T02:30:00.000Z",
                    }
                ],

            },
            {
                "name": "Setup",
                "id": "2",

                "tasks": [
                    {
                        "id": "1",
                        "name": "是案件",
                        "color": "#F1C232",
                        from: "2013-10-09T00:30:00.000Z",
                        to: "2013-10-09T00:30:00.000Z",
                    },
                    {
                        "id": "2",
                        "name": "是案件",
                        "color": "#FF9766",
                        from: "2013-10-09T01:30:00.000Z",
                        to: "2013-10-09T02:30:00.000Z",
                    }
                ],

            }



            //{
            //    "name": "Setup",
            //    "id": "2",
            //    "tasks": [
            //        {
            //            "id": "2",
            //            "name": "是大法师",
            //            "color": '#FF00FF',
            //            from: "2013-10-09T03:30:00.000Z",
            //            to: "2013-10-09T04:30:00.000Z",
            //        }
            //    ]
            //
            //}

        ]


        //var data3 = [
        //    {
        //        name: '标题1',
        //        //height: '1.5em',
        //        content: "内容有了,就不显示标题了",
        //        classes: 'gantt-row-milestone',
        //        //color: '#fff',
        //        tasks: [
        //            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
        //            {
        //                name: '任务1',
        //                color: '#93C47D',
        //                from: '2013-10-06T09:00:00',
        //                to: '2013-10-06T12:00:00',
        //                data: function () {
        //                    console.log("asdf")
        //                }
        //            },
        //            {
        //                name: '任务2',
        //                color: '#93C47D',
        //                from: '2013-10-08T00:00:00',
        //                to: '2013-10-08T12:00:00',
        //
        //            },
        //            //{
        //            //    name: 'Concept approval',
        //            //    color: '#93C47D',
        //            //    from: new Date(2013, 9, 18, 18, 0, 0),
        //            //    to: new Date(2013, 9, 18, 18, 0, 0),
        //            //    est: new Date(2013, 9, 16, 7, 0, 0),
        //            //    lct: new Date(2013, 9, 19, 0, 0, 0)
        //            //}
        //        ],
        //
        //    },
        //    //{
        //    //    name: '标题2',
        //    //
        //    //    tasks: [
        //    //        // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
        //    //        {
        //    //            name: 'Kickoff',
        //    //            color: '#93C47D',
        //    //            from: '2013-10-07T00:00:00',
        //    //            to: '2013-10-07T12:00:00',
        //    //
        //    //        },
        //    //        {
        //    //            name: 'Kickoff2',
        //    //            color: '#93C47D',
        //    //            from: '2013-10-08T00:00:00',
        //    //            to: '2013-10-08T24:00:00',
        //    //
        //    //        },
        //    //        //{
        //    //        //    name: 'Concept approval',
        //    //        //    color: '#93C47D',
        //    //        //    from: new Date(2013, 9, 18, 18, 0, 0),
        //    //        //    to: new Date(2013, 9, 18, 18, 0, 0),
        //    //        //    est: new Date(2013, 9, 16, 7, 0, 0),
        //    //        //    lct: new Date(2013, 9, 19, 0, 0, 0)
        //    //        //}
        //    //    ],
        //    //
        //    //},
        //    //{
        //    //    name: '标题2',
        //    //
        //    //    tasks: [
        //    //        // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
        //    //        {
        //    //            name: 'Kickoff',
        //    //            color: '#93C47D',
        //    //            from: '2013-10-01T00:00:00',
        //    //            to: '2013-10-01T12:00:00',
        //    //
        //    //        },
        //    //        {
        //    //            name: 'Kickoff2',
        //    //            color: '#93C47D',
        //    //            from: '2013-10-08T00:00:00',
        //    //            to: '2013-10-08T24:00:00',
        //    //
        //    //        },
        //    //        //{
        //    //        //    name: 'Concept approval',
        //    //        //    color: '#93C47D',
        //    //        //    from: new Date(2013, 9, 18, 18, 0, 0),
        //    //        //    to: new Date(2013, 9, 18, 18, 0, 0),
        //    //        //    est: new Date(2013, 9, 16, 7, 0, 0),
        //    //        //    lct: new Date(2013, 9, 19, 0, 0, 0)
        //    //        //}
        //    //    ],
        //    //
        //    //},
        //]

        $scope.live = "";

        lh_ajax.get({
            url:"server_json/data.json",
            success:function(msg){
                console.log(msg);
                $scope.data = msg.data;

            }
        });

        $scope.$watch('live', function(newVal,oldVal){
            console.log("改变了");
            console.log(newVal);
            console.log(oldVal);

            $scope.live = angular.toJson(newVal);
        });





        $scope.rili = {
            riqi: 'hour',
            labelsEnabled: true, //是否显示侧边
            daily: false, //每日
            draw: false,

            drawTaskFactory: function () { //直接增加任务进度的地方
                return {
                    //id: utils.randomUuid(),  // Unique id of the task.
                    name: 'Drawn task', // Name shown on top of each task.
                    color: '#AA8833', // Color of the task in HEX format (Optional).

                };
            },


            api: function (api) {
                $scope.api = api;
                api.core.on.ready($scope, function () {
                    // Call API methods and register events.
                    //console.log(api);

                    //获取增加新任务的数据
                    api.tasks.on.add($scope, logTaskEvent);

                    //api.tasks.on.resizeBegin($scope, addEventName('tasks.on.resizeBegin', logTaskEvent));


                    api.tasks.on.rowChange($scope, function(task) {
                        $scope.live.row = task.row.model;
                        console.log(row)
                    });

                    api.directives.on.new($scope, function(directiveName, directiveScope, element, dAttrs, dController) {
                        if (directiveName === 'ganttTask') {

                            console.log(directiveName);
                            element.bind('dblclick', function(event) {
                                event.stopPropagation();
                                logTaskEvent2(directiveScope.task);
                                $scope.rowEdit=directiveScope.task.model;
                            });

                        }
                    });


                    //api.directives.on.new($scope, function(directiveName, directiveScope, element) {
                    //    if (directiveName === 'ganttTask') {
                    //        element.bind('click', function(event) {
                    //            event.stopPropagation();
                    //            logTaskEvent('task-click', directiveScope.task);
                    //        });
                    //        element.bind('mousedown touchstart', function(event) {
                    //            event.stopPropagation();
                    //            $scope.live.row = directiveScope.task.row.model;
                    //            if (directiveScope.task.originalModel !== undefined) {
                    //                $scope.live.task = directiveScope.task.originalModel;
                    //            } else {
                    //                $scope.live.task = directiveScope.task.model;
                    //            }
                    //            $scope.$digest();
                    //        });
                    //    } else if (directiveName === 'ganttRow') {
                    //        element.bind('click', function(event) {
                    //            event.stopPropagation();
                    //            logRowEvent('row-click', directiveScope.row);
                    //        });
                    //        element.bind('mousedown touchstart', function(event) {
                    //            event.stopPropagation();
                    //            $scope.live.row = directiveScope.row.model;
                    //            $scope.$digest();
                    //        });
                    //    } else if (directiveName === 'ganttRowLabel') {
                    //        element.bind('click', function() {
                    //            logRowEvent('row-label-click', directiveScope.row);
                    //        });
                    //        element.bind('mousedown touchstart', function() {
                    //            $scope.live.row = directiveScope.row.model;
                    //            $scope.$digest();
                    //        });
                    //    }
                    //});

                })
            }
        };


        // Event handler 获取新增的任务数据
        var logTaskEvent = function (task) {
            //$log.info('[Event] ' + eventName + ': ' + task.model.name);

            //var day = moment(task.model.from).format();
            console.log(task.row.tasks)
            //console.log(day)


            //$scope.data.tasks.push(task.model);



        };


        //$scope.editFrom={};
        var logTaskEvent2 = function (task) {
            $("#editTime").modal("show");

            $scope.editFrom={
                taskName:task.model.name,
                taskFrom:task.model.from, //开始时间
                taskTo:task.model.to, //结束时间
                taskColor:task.model.color
            };



        };


        //点击修改任务按钮
        $scope.editClick=function(){

            $scope.rowEdit.name=$scope.editFrom.taskName;
            $scope.rowEdit.from=moment($scope.editFrom.taskFrom);
            $scope.rowEdit.to=moment($scope.editFrom.taskTo);
            $scope.rowEdit.color=$scope.editFrom.taskColor;
            $("#editTime").modal("hide");
        };






        // Event utility function 事件运行的方法
        var addEventName = function (eventName, func) {
            return function (data) {
                return func(eventName, data);
            };
        };

        // Event handler
        //var logTimespanEvent = function(eventName, timespan) {
        //    $log.info('[Event] ' + eventName + ': ' + timespan.model.name);
        //};

        //增加任务
        //$scope.drawTaskFactory = function () {
        //    var newTask = {
        //        color: '#93C47D',
        //        name: 'New Task'
        //        // Other properties
        //    }
        //
        //    return newTask;
        //}
        //
        //
        //
        //
        //$scope.load();


        //$scope.registerApi = function (api) {
        //
        //    api.core.on.ready($scope, function () {
        //        // Call API methods and register events.
        //        console.log(api)
        //    })
        //}

    }]);

