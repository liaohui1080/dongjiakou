/**
 * Created by liaohui1080 on 16/2/26.
 *
 * 指令创建页面
 */
var wangEditDirective = (function () {

    var wangEdit = [function () {
     return {
         restrict: 'A',
         require: 'ngModel',
         scope: {
             parameter: "=", //自定义菜单
             editData:"=" //给编辑器初始化值
         },
         link: function (scope, element, attrs, ctrl) {


             // 创建编辑器
             var editor = new wangEditor(element);

             editor.onchange = function () {
                 // 从 onchange 函数中更新数据
                 scope.$apply(function () {
                     var html = editor.$txt.html();
                     ctrl.$setViewValue(html);
                 });
             };

             // 自定义菜单 ,通过 parameter来获取 菜单参数
             editor.config.menus = scope.parameter;

             editor.create();

             //给编辑器初始化值
             editor.$txt.html(scope.editData);
         }
     };
    }];


    return {wangEdit: wangEdit}
})();

