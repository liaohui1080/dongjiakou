/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 过滤器创建页面
 */

var lhFilter=(function(){



    //分页过滤器
    var pageStart=[function () {
        return function(input, start) {
            start = +start;

            if (input){
                return input.slice(start);
            }

        }

    }];


    // Y , N 转汉字
    var YNtoHanzi=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="启用"
            }
            if(input=='N'){
                str="禁用"
            }

            return str

        }

    }];


    // Y , N 在线离线
    var YNtoZaixian=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="在线"
            }
            if(input=='N'){
                str="离线"
            }

            return str

        }

    }];

    //ui-select菜单必须用到的
    var uiSelectPropsFilter=[function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }];


    return {
        uiSelectPropsFilter:uiSelectPropsFilter,
        YNtoHanzi:YNtoHanzi,
        YNtoZaixian:YNtoZaixian,
        pageStart:pageStart
    };

})();







