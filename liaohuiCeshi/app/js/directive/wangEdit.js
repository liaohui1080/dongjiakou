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
                editData: "=", //给编辑器初始化值

            },
            link: function (scope, element, attrs, ctrl) {


                // 创建编辑器
                var editor = new wangEditor(element);
                // 自定义菜单 ,通过 parameter来获取 菜单参数
                editor.config.menus = scope.parameter;

                //实时抛出输入的数据
                editor.onchange = function () {


                        var html = editor.$txt.html();
                        ctrl.$setViewValue(html);

                };
                editor.create();

                //给编辑器默认值
                editor.$txt.html(scope.editData);

                //点击编辑器的时候,清空编辑器的值,然后把默认值重新给编辑器
                element.on("click",function(e){
                   
                    editor.$txt.html(scope.editData);
                });


            }
        };
    }];


    return {wangEdit: wangEdit}
})();

