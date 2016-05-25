var myApp = angular.module('myApp', [
    "ngSanitize", // 输出html
    'objectTable',
]);


//factory  服务添加位置
myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务


myApp.controller('rootController', ['$scope', 'lh_ajax', '$timeout', function ($scope, lh_ajax, $timeout) {
    var ganttData = [
        {
            id: 1, name: "Feature 1", series: [
            {name: "Planned", start: new Date(2010, 00, 01), end: new Date(2010, 00, 03)},
            {name: "Actual", start: new Date(2010, 00, 02), end: new Date(2010, 00, 05), color: "#f0f0f0"}
        ]
        },
        {
            id: 2, name: "Feature 2", series: [
            {name: "Planned", start: new Date(2010, 00, 05), end: new Date(2010, 00, 20)},
            {name: "Actual", start: new Date(2010, 00, 06), end: new Date(2010, 00, 17), color: "#f0f0f0"},
            {name: "Projected", start: new Date(2010, 00, 06), end: new Date(2010, 00, 17), color: "#e0e0e0"}
        ]
        },
        {
            id: 3, name: "Feature 3", series: [
            {name: "Planned", start: new Date(2010, 00, 11), end: new Date(2010, 01, 03)},
            {name: "Actual", start: new Date(2010, 00, 15), end: new Date(2010, 01, 03), color: "#f0f0f0"}
        ]
        },
        {
            id: 4, name: "Feature 4", series: [
            {name: "Planned", start: new Date(2010, 01, 01), end: new Date(2010, 01, 03)},
            {name: "Actual", start: new Date(2010, 01, 01), end: new Date(2010, 01, 05), color: "#f0f0f0"}
        ]
        },
        {
            id: 5, name: "Feature 5", series: [
            {name: "Planned", start: new Date(2010, 02, 01), end: new Date(2010, 03, 20)},
            {name: "Actual", start: new Date(2010, 02, 01), end: new Date(2010, 03, 26), color: "#f0f0f0"}
        ]
        },
        {
            id: 6, name: "Feature 6", series: [
            {name: "Planned", start: new Date(2010, 00, 05), end: new Date(2010, 00, 20)},
            {name: "Actual", start: new Date(2010, 00, 06), end: new Date(2010, 00, 17), color: "#f0f0f0"},
            {name: "Projected", start: new Date(2010, 00, 06), end: new Date(2010, 00, 20), color: "#e0e0e0"}
        ]
        },
        {
            id: 7, name: "Feature 7", series: [
            {name: "Planned", start: new Date(2010, 00, 11), end: new Date(2010, 01, 03)}
        ]
        },
        {
            id: 8, name: "Feature 8", series: [
            {name: "Planned", start: new Date(2010, 01, 01), end: new Date(2010, 01, 03)},
            {name: "Actual", start: new Date(2010, 01, 01), end: new Date(2010, 01, 05), color: "#f0f0f0"}
        ]
        }
    ];

    //
    // $(".gantt").ganttView({
    //     data: ganttData,
    //     slideWidth: 1000,
    //     scale: "hours",
    //     behavior: {
    //         onClick: function (data) {
    //             var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
    //             $("#eventMessage").text(msg);
    //         },
    //         onResize: function (data) {
    //             var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
    //             $("#eventMessage").text(msg);
    //         },
    //         onDrag: function (data) {
    //             var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }";
    //             $("#eventMessage").text(msg);
    //         }
    //     }
    // });


    var data = [
        {
            "name": " Step A ",
            "desc": "&rarr; Step B",
            "values": [{
                "id": "b0",
                "from": "/Date(1462813200000)/",
                "to": "/Date(1462881600000)/",
                "desc": "Id: 0<br/>Name:   Step A",
                "label": " Step A",
                "customClass": "ganttRed",
                "dep": "b1"
            }]
        }
    ];

    $(".gantt").gantt({
        source: data,
        navigate: "scroll",
        startPos:1462813200000,
        scale: "hours",
        maxScale: "day",
        minScale: "day",
        itemsPerPage: 10,
        dow: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        // useCookie: true,
        scrollToToday: true,
        onItemClick: function (data) {
            console.log(data)
            alert("Item clicked - show some details");
        },
        onAddClick: function (dt, rowId) {
            alert("Empty space clicked - add an item!");
        },
        onRender: function () {
            console.log("chart rendered");
        }


    });

    $(".gantt").popover({
        selector: ".bar",
        title: "I'm a popover",
        content: "And I'm the content of said popover.",
        trigger: "hover"
    });


    // $(".gantt").gantt({source: data, navigate: 'scroll', scale: 'hours', maxScale: 'weeks', minScale: 'hours'});


}]);

