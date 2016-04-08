/**
 * Created by liaohui1080 on 16/4/5.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');


//从文件内读取json数据, 并输出到客户端
var jsonTo = function (res, jsonPath) {
    fs.readFile(jsonPath, function (err, msg) {
        if (err) {
        } else {
            //console.log(msg.toString());
            res.writeHead(200, {'Content-Type': 'application/json'});
            //输出数据
            res.end(msg.toString());

        }
    });
};

var proxy = http.createServer(function (req, res) {


    //获取接收的参数
    var getQuery = url.parse(req.url, true).query;  //方法二arg => { aa: '001', bb: '002'
    //var getQuery2 = url.parse(req.url).query;  //方法二arg => { aa: '001', bb: '002'

    //console.log(getQuery2);
    //console.log(getQuery.timeScale.toString());
    //console.log(getQuery.timeSpans.toString());
    //console.log(getQuery.userType.toString());
    //console.log(getQuery.data.toString());
    aa(getQuery.timeScale);
    aa(getQuery.timeSpans);
    aa(getQuery.userType);
    aa(getQuery.data);
    aa(getQuery.action);


    function aa(o) {
        if (o) {
            console.log(o.toString());
        }

    }


    if(aa(getQuery.action)){

        console.log(aa(getQuery.action)+"==")
        res.writeHead(200, {'Content-Type': 'application/json'});

        var ss = {
            "status": 1,
            "info": "操作成功",

            "data": ""
        };
        //输出数据
        res.end(ss.toString());
    }else{


        if (getQuery.userType === 'person') {

            //获取时间类型
            switch (getQuery.timeScale) {
                case "day":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'person/day.json');
                    break;
                case "week":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'person/week.json');
                    break;
                case "month":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'person/month.json');
                    break;
                case "year":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'person/year.json');
                    break;
                default :
                    console.log(getQuery.timeScale);
                    jsonTo(res, 'person/day.json'.toString());
            }
        } else if (getQuery.userType === 'leader') {
            //获取时间类型
            switch (getQuery.timeScale) {
                case "day":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'leader/day.json');
                    break;
                case "week":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'leader/week.json');
                    break;
                case "month":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'leader/month.json');
                    break;
                case "year":
                    console.log(getQuery.timeScale.toString());
                    jsonTo(res, 'leader/year.json');
                    break;
                default :
                    console.log(getQuery.timeScale);
                    jsonTo(res, 'leader/day.json'.toString());
            }
        }
    }




}).listen(1337, '127.0.0.1', function () {
    console.log('运行  http://127.0.0.1:1337/');


});



