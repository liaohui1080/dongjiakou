var http = require('http');
var url = require('url');
var fs = require('fs');
var data = {key: 'sdfads', hello: '参数'};

var proxy = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    //获取接收的参数
    var arg = url.parse(req.url, true).query;  //方法二arg => { aa: '001', bb: '002'

    console.log(arg);

    res.end(JSON.stringify(data));


}).listen(1337, '127.0.0.1', function () {
    console.log('Server running at http://127.0.0.1:1337/');


});

var outputFilename = 'shell/my.json';
fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("JSON saved to " + outputFilename);
    }
});
