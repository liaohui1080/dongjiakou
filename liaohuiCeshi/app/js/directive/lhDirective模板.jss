/**
 * Created by liaohui1080 on 16/2/26.
 *
 * 指令创建页面
 */
var lhDirective = (function () {

    var lookup = ["lh_http", function (lh_http) {
        return {
            restrict: 'EA',
            templateUrl: 'toggle.html',
            replace: true,
            transclude: true,
            scope: {
                items: "=", //列表数据
                title: "@", //标题
                data: "=",  //返回数据
                url: "@",   //url地址
                info: "=",   //状态
                sousuoInput: "=",   //文本框的值
                kongjianname: "@", //输入框name
                btnIcon: "@" //icon
            },
            link: function (scope, element, attrs) {

                scope.sousuoInput = '';

                scope.itemClick = function (o) {
                    scope.sousuoInput = scope.items[o].groupName;
                    scope.data = scope.items[o];
                    element.find(".dropdown-menu").hide();
                    scope.info = false;

                };

                scope.sousuoInputChange = function () {
                    if (scope.sousuoInput) {
                        scope.info = false;
                    }
                };


                scope.itemClose = function () {
                    scope.data = '';
                    scope.sousuoInput = '';
                    //element.removeClass("has-success");
                    element.find(".dropdown-menu").hide();

                };

                scope.sousuoBtnClick = function () {

                    if (!scope.sousuoInput) {
                        //element.addClass("has-error");
                        element.find(".dropdown-menu").hide();
                        scope.info = true;
                    } else {
                        //element.removeClass("has-error");
                        element.find(".dropdown-menu").show();
                        scope.loadingShow = true;
                        scope.itemShow = false;

                        lh_http.get({
                            url: scope.url,
                            data: {paramtersValue: scope.sousuoInput},
                            success: function (data) {
                                console.log(data);

                                if (data.status) {
                                    scope.loadingShow = false;
                                    scope.itemShow = true;

                                    scope.items = data.data;
                                } else {

                                    alert("服务器数据格式错误");
                                }

                            },
                            error: function () {

                            }
                        });
                    }


                }

            }
        };
    }];




    return {lookup: lookup}
})();

