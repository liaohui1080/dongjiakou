
---
title: djk项目控件介绍Demo
tags: 董家口
comments: true
---


> ### [djk项目前端代码库 https://github.com/liaohui1080/dongjiakou](https://github.com/liaohui1080/dongjiakou)




##### 组织架构
    需要引入的控件
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'treeGrid'

* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/组织架构/组织架构.html)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app//html/组织架构)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/组织架构)


---


##### 分配权限页面
    需要引入的控件
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "w5c.validator",
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'uiSwitch'
* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/分配权限/分配权限.html)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/分配权限)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/分配权限)


 ---


##### 表格例子 object-table
    需要引入的控件
    'objectTable',
    "w5c.validator", //表单验证
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条
    'ngNotify' //弹出提示
* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/表格列子object_table/index.html)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/表格列子object_table)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/表格列子object_table)


---


##### 下拉菜单例子 ui-select
    需要引入的控件
    "w5c.validator", //表单验证
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条
    'ngNotify' //弹出提示
* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/下拉菜单select/index.html)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/下拉菜单select)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/下拉菜单select)


---

##### gantt图
    需要引入的控件
    "angular-loading-bar", //加载进度条=
    'ngNotify',//弹出提示
    "ngSanitize", // 输出html
    "w5c.validator",
    'jp.ng-bs-animated-button',
    "ui.select", // 下拉菜单
    'gantt',
    'gantt.table',
    'gantt.movable',
    'gantt.tooltips',
    'gantt.drawtask',
    'mgcrea.ngStrap'
* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/日历rili)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/日历rili)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/日历rili)

---

##### 应急预案浏览
    需要引入的控件

* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/应急预案浏览)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/应急预案浏览)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/应急预案浏览)

---

##### 编辑器 wangEdit
    需要引入的控件
    编辑器的文件已经合并到了 main.js main.css
    另外字体font文件夹,必须放到 main.css 同一个目录里面

    //直接在当前js页面,引入指令
    myApp.directive("wangEdit", wangEditDirective.wangEdit); //加载编辑器

    //html写法 ,ng-model="editcontent" 是为了获取用户输入内容的
    edit-data="editcontent" 是初始化编辑器内容的
     parameter= []  是控制显示菜单内容的

    <div ng-model="editcontent"
                     wang-edit="true"
                     edit-data="editcontent"
                     parameter="['source','bold','underline','italic','strikethrough','eraser','forecolor','bgcolor']"></div>
                <div ng-bind="editcontent"></div>


* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/编辑器)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/编辑器)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/编辑器)


---

##### 我的消息页面
    需要引入的控件
    //factory  服务添加位置
    myApp.factory("lh_ajax", lhFactory.ajax2); //新ajax服务,使用新的 加载状态 和提示状态
    myApp.filter("timeFormat", lhFilter.timeFormat); //新ajax服务




* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/我的消息)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/我的消息)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/我的消息)


---

##### d3图形展示,危险源检测-在线图表展示
    需要引入的控件
    //factory  服务添加位置
    myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务,使用新的 加载状态 和提示状态





* [demo](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/d3拓补图)
* [html](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/html/d3拓补图)
* [js](https://github.com/liaohui1080/dongjiakou/tree/gh-pages/liaohuiCeshi/app/js/controller/d3拓补图)



## 代码实例


#### 过滤器

Y-N 转换汉字

    myApp.filter("YNtoHanzi",[function () {
        return function(input, str) {

            if(input=='Y'){
                str="启用"
            }
            if(input=='N'){
                str="禁用"
            }

            return str

        }

    }]);

    html 使用
    <div>{{abc | YNtoHanzi:abc}}<div>


时间年月日星期分秒  timeFormat:'YYYY年MM月DD日 DD=星期,必须大写星期才能输出正确 H:mm:ss'

	//引入时间格式化过滤器
   	myApp.factory("timeFormat", lhFilter.timeFormat);

    var timeFormat=[function () {
        return function (input, str) {
            return moment(input).format(str)
        }

    }];
    html 使用
    <div>{{要过滤的时间 | timeFormat:"YYYY年MM月DD日"}}<div>




#### 服务
新ajax 使用方法

    //factory  服务添加位置
	myApp.factory("lh_ajax", lhFactory.ajax); //新ajax服务
    lh_ajax.get({
            url: "server_json/chart_data.json",
            success: function (msg) {

                quxiantu(msg.data)
            }
      })


