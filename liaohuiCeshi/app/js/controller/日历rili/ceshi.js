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

//时间格式化 timeFormat:'YYYY年MM月dd日 dddd=星期 H:mm:ss'
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

        var taskUrl = "server_json/person.json";

        //控制btn加载状态
        $scope.isSubmitting = null;
        $scope.result = null;


        //从服务器获取数据
        $scope.ajax = function (o, fn) {
            //o={
            //    type:"", //时间类型
            //    today:true, //是否显示当天
            //    timeSpans:{from:"开始",to:"结束"} //时间间隔
            //};

            lh_ajax.get({
                url: taskUrl,
                data: o,
                success: function (msg) {
                    //console.log(msg);
                    $scope.data = msg.data;

                    if (fn) {
                        fn()
                    }
                }
            });
        };


        //var nowTime = new Date();

        //$scope.message = {
        //    text: 'hello world!',
        //    //time: moment(nowTime).format('YYYY年MM月dd日')
        //    time: nowTime
        //};


        //获取今天日期
        $scope.today = new Date();
        console.log(moment($scope.today))
        var dd = moment('2013-10-06T02:20:00.000Z');
        $scope.dataQuery = {
            taskFrom: dd,
            //taskTo:nowTime
        };












        //日期查询按钮
        $scope.dataQueryBtn = {
            buttonDefaultClass: 'btn-primary btn-sm', //默认状态
            buttonSubmittingClass: 'btn-primary btn-sm', // 加载状态
            buttonDefaultText: '查询', //默认文字
            buttonSubmittingText: ".", //加载文字
            buttonSuccessText: ".",  //成功文字
            buttonSuccessClass: 'btn-success btn-sm' //成功状态

        };

        //今天 按钮设置
        $scope.todayBtn = {
            buttonDefaultClass: 'btn-primary btn-sm', //默认状态
            buttonSubmittingClass: 'btn-primary btn-sm', // 加载状态
            buttonDefaultText: '今天', //默认文字
            buttonSubmittingText: ".", //加载文字
            buttonSuccessText: ".",  //成功文字
            buttonSuccessClass: 'btn-success btn-sm' //成功状态

        };
        //返回今天的任务计划
        $scope.todayClick = function () {
            $scope.isSubmitting = true;
            $scope.ajax({type: $scope.options.scale, today: true}, function () {
                $scope.result = 'success';
            });
        };







        //当前显示规模切换
        $scope.timeType={};
        //$scope.timeType.data = [
        //    {"value": "year", "name": "当年"},
        //    {"value": "month", "name": "当月"},
        //    {"value": "week", "name": "当周"},
        //    {"value": "day", "name": "今天"}
        //];


        $scope.timeType={
            data:[
                {"value": "year", "name": "当年"},
                {"value": "month", "name": "当月"},
                {"value": "week", "name": "当周"},
                {"value": "day", "name": "今天"}
            ],
            upClick:function(o){
                console.log("上"+o);
                $scope.ajax("要传的参数");
            },
            lowClick:function(o){
                console.log("下"+o);
                $scope.ajax("要传的参数");
            }
        };

        //控制当前日历显示规模
        var scaleWacth = $scope.$watch('options.scale', function (newVal, oleVal, scope) {
            console.log(newVal);
            //console.log(oleVal)

            switch (newVal) {
                //case "hour":
                //    $scope.ajax({type: newVal});
                //    $scope.options.headers = ['hour'];
                //    break;
                case "day":
                    $scope.ajax(newVal, "");
                    $scope.options.headers = ['hour'];
                    $scope.timeType.up="上一天";
                    $scope.timeType.low="下一天";
                    break;
                case "week":
                    $scope.ajax(newVal, "");
                    $scope.options.headers = ['day'];
                    $scope.timeType.up="上一周";
                    $scope.timeType.low="下一周";
                    break;
                case "month":
                    $scope.ajax(newVal, "");
                    $scope.options.headers = ['day'];
                    $scope.timeType.up="上一月";
                    $scope.timeType.low="下一月";
                    break;
                case "year":
                    $scope.ajax(newVal, "");
                    $scope.options.headers = ['month'];
                    $scope.timeType.up="上一年";
                    $scope.timeType.low="下一年";
                    break;
                default :
                    $scope.ajax('day', "");
            }
        });





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

            scale: 'day',
            labelsEnabled: true, //是否显示侧边
            daily: false, //每日
            draw: false,
            readOnly: false,
            zoom: undefined,
            headers: "['month','day','hour']",
            width: false,
            drawTaskFactory: function () { //直接增加任务进度的地方
                return {
                    //id: utils.randomUuid(),  // Unique id of the task.
                    name: '新任务', // Name shown on top of each task.
                    color: '#AA8833', // Color of the task in HEX format (Optional).

                };
            },

            api: function (api) {
                $scope.api = api;
                api.core.on.ready($scope, function () {

                    //api.tasks.on.change($scope, addEventName('tasks.on.change', logTaskEvent));
                    api.tasks.on.add($scope, addEventName('tasks.on.add', logTaskEvent));
                    //api.tasks.on.rowChange($scope, addEventName('tasks.on.rowChange', logTaskEvent));


                    if (api.tasks.on.moveBegin) {
                        api.tasks.on.moveBegin($scope, addEventName('tasks.on.moveBegin', logTaskEvent));
                        //api.tasks.on.move($scope, addEventName('tasks.on.move', logTaskEvent));
                        api.tasks.on.moveEnd($scope, addEventName('tasks.on.moveEnd', logTaskEvent));

                        api.tasks.on.resizeBegin($scope, addEventName('tasks.on.resizeBegin', logTaskEvent));
                        //api.tasks.on.resize($scope, addEventName('tasks.on.resize', logTaskEvent));
                        api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resizeEnd', logTaskEvent));
                    }


                    api.directives.on.new($scope, function (directiveName, directiveScope, element, dAttrs, dController) {
                        if (directiveName === 'ganttTask') {


                            element.bind('dblclick', function (event) {
                                event.stopPropagation();

                                logTaskEvent2('task-click', directiveScope.task);

                            });

                        }
                    });
                })
            }
        };


        // Event handler
        var logTaskEvent = function (eventName, task) {
            console.log('[Event] ' + eventName + ': ' + task.model.name);
            //$scope.live.taskJson = angular.toJson(task.model, true);
            //$scope.live.rowJson = angular.toJson(task.row.model, true);
            //
            //
            //$("#editTime").modal("show");
            //$scope.rowEdit=task.model;

            console.log(task.model)
        };


        var logTaskEvent2 = function (eventName, task) {
            console.log('[Event] ' + eventName + ': ' + task.model.name);
            //$scope.live.taskJson = angular.toJson(task.model, true);
            //$scope.live.rowJson = angular.toJson(task.row.model, true);
            //
            //
            $("#editTime").modal("show");
            $scope.rowEdit = task.model;
            $scope.editFrom = {
                taskName: task.model.name,
                taskFrom: task.model.from, //开始时间
                taskTo: task.model.to, //结束时间
                taskColor: task.model.color
            };


            console.log(task.model.from)
        };

        //点击修改任务按钮
        $scope.editClick = function () {

            $scope.rowEdit.name = $scope.editFrom.taskName;
            $scope.rowEdit.from = moment($scope.editFrom.taskFrom);
            $scope.rowEdit.to = moment($scope.editFrom.taskTo);
            $scope.rowEdit.color = $scope.editFrom.taskColor;
            $("#editTime").modal("hide");

            console.log(moment($scope.editFrom.taskFrom))
        };


        // Event utility function //显示事件名字
        var addEventName = function (eventName, func) {
            return function (data) {
                return func(eventName, data);
            };
        };


    }]);

