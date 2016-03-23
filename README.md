## 项目控件介绍Demo



####组织架构 
    需要引入的控件
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'treeGrid'
* [分配权限页面](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/组织架构/组织架构.html)
* [html](liaohuiCeshi/app/html/组织架构)
* [js](liaohuiCeshi/app/js/controller/组织架构)


####分配权限页面 
    需要引入的控件
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "w5c.validator",
    "angular-loading-bar", //加载进度条=
    'ngNotify', //弹出提示
    'uiSwitch' 
* [分配权限页面](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/分配权限/分配权限.html)
* [html](liaohuiCeshi/app/html/分配权限)
* [js](liaohuiCeshi/app/js/controller/分配权限)
 
    
    
#####表格例子 object-table
    需要引入的控件
    'objectTable',
    "w5c.validator", //表单验证
    "ui.select", // 下拉菜单
    "ngSanitize", // 输出html
    "angular-loading-bar", //加载进度条
    'ngNotify' //弹出提示
* [分配权限页面](http://liaohui1080.github.io/dongjiakou/liaohuiCeshi/app/html/表格列子object_table/index.html)
* [html](liaohuiCeshi/app/html/表格列子object_table)
* [js](liaohuiCeshi/app/js/controller/表格列子object_table)


##代码实例


    ###过滤器
    
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
