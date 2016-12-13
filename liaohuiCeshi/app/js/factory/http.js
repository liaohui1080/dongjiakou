/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 服务创建页面
 */

var lhFactory = (function () {


    /*
     * http 服务
     * 参数
     * o ={url:"服务器url地址" ,
     * params:{"参数key":"参数val"}这个会追加到 url后面,
     * success:function(){} 成功消息,
     * error:function(){} 失败消息
     * }
     * */
    var http = ["$http", function ($http) {

        var ajax = {

            "get": function (o) {
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            },
            "post": function (o) {

                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            }

        };

        return ajax;
    }];



    /*
    * {url:url地址,infoSuccess:成功消息内容,infoError:失败消息内容 ,infoShow:true false 控制是否显示 ,success:成功方法}
    *   使用angualr的  'cfpLoadingBar', 'ngNotify' 才能运行
    *
    * */
    var ajax2 = ["$http", 'cfpLoadingBar', 'ngNotify', function ($http, cfpLoadingBar, ngNotify) {

        var ajax = {


            "get": function (o) {
                cfpLoadingBar.start();
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {
                    cfpLoadingBar.complete();

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            ngNotify.set(infoSuccess, {
                                position: 'top',
                                duration: 1500,
                                type: "success"
                            });
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            ngNotify.set(infoError, {
                                position: 'top',
                                duration: 1500,
                                type: "warn"
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);
                });
            },
            "post": function (o) {
                cfpLoadingBar.start();
                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {
                    cfpLoadingBar.complete();

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            ngNotify.set(infoSuccess, {
                                position: 'top',
                                duration: 1500,
                                type: "success"
                            });
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            ngNotify.set(infoError, {
                                position: 'top',
                                duration: 1500,
                                type: "warn"
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);

                });
            }
        };

        return ajax;
    }];




    /* 使用 layer  进度加载 和 提示框
     * {url:url地址,infoSuccess:成功消息内容,
     * infoError:失败消息内容 ,
     * infoShow:true false 控制是否显示 ,
     * data:{"id":值},
     * success:成功方法}
     *
     *
     * */
    var ajax = ["$http", function ($http) {

        var ajax = {


            "get": function (o) {
                // cfpLoadingBar.start();
                var load=layer.load(1);
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {
                    // cfpLoadingBar.complete();
                    layer.close(load);
                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){


                            layer.msg(infoSuccess);
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {



                            layer.msg(infoError, function(){
                                //回震动提示的
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器数据格式错误"+e);
                    layer.msg("服务器数据格式错误."+e, function(){
                        //回震动提示的
                    });
                });
            },
            "post": function (o) {
                var load=layer.load(1);
                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {
                    layer.close(load);

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            layer.msg(infoSuccess);
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            layer.msg(infoError, function(){
                                //回震动提示的
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器数据格式错误"+e);
                    //console.log(e);
                    layer.msg("服务器数据格式错误."+e, function(){
                        //回震动提示的
                    });
                });
            }
        };

        return ajax;
    }];


    return {
        http: http,
        ajax: ajax,
        ajax2: ajax2,

    };

})();


