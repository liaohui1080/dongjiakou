/**
 * Created by liaohui1080 on 15/12/27.
 */
var gulp = require('gulp');
// 引入组件
var concat = require('gulp-concat');//文件合并
var rename = require('gulp-rename');//文件更名
var notify = require('gulp-notify');//提示信息
var connect = require('gulp-connect');//服务器
var shell = require('gulp-shell')
var uglify = require('gulp-uglify');//js压缩
var minifycss = require('gulp-minify-css');//css压缩


var jsArr = [

    //时间格式化插件, 很多地方要用到
    'bower_components/moment/moment.js',

    //把时间本地化,显示汉字,几乎所有遵循标准的都可以显示
    'bower_components/moment/locale/zh-cn.js',

    //让js 同步执行代码
    'node_modules/async/dist/async.min.js',


    //弹出层 提示框 加载状态 提示信息
    'lh_js_diy/layer/pc/layer.js',

    'bower_components/ng-notify/dist/ng-notify.min.js',//提示信息

    'bower_components/angular-loading-bar/build/loading-bar.min.js', //加载进度条
    'node_modules/angular-sanitize/angular-sanitize.min.js', //ng-bind-html 输出
    'node_modules/ui-select/dist/select.js', //ui-select
    'bower_components/w5c-validator/w5cValidator.min.js', // 表单验证


    //文件上传
    'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
    'bower_components/ng-file-upload/ng-file-upload.min.js',

    //表格
    'lh_js_diy/angular-object-table/build/object-table.js',

    //树
    'lh_js_diy/tree-grid-directive4019/src/tree-grid-directive.js',


    //angular-ui-switch
    'bower_components/angular-ui-switch/angular-ui-switch.min.js',


    //带加载状态的按钮
    'bower_components/ng-bs-animated-button/ng-bs-animated-button.js',

    //ganttt 图用到的
    'bower_components/angular-moment/angular-moment.js',
    'bower_components/angular-gantt/dist/angular-gantt.js',
    'bower_components/angular-gantt/dist/angular-gantt-plugins.js',


    //angular-strap 一个bootsrap 的库,主要用到了时间选择器功能
    'bower_components/angular-strap/dist/angular-strap.js',
    'bower_components/angular-strap/dist/angular-strap.tpl.js',


    'p/js/service/*.js',  //模块
    'app/js/factory/*.js',  //服务
    'app/js/filter/*.js',  //服务
    'app/js/directive/*.js', //指令

];

//js本地页面编译,只对应当前页面的js
var jsArrBendi = [

    'app/js/controller/**/*.js'

];

var cssArr = [
    'bower_components/w5c-validator/style.css', //表单验证
    'node_modules/ui-select/dist/select.css',  //ui-select下拉菜单
    'lh_public/select2.css',//ui-select下拉菜单
    'lh_public/selectize.default.css',//ui-select下拉菜单
    'bower_components/angular-loading-bar/build/loading-bar.min.css', //加载进度条

    ///下面三个是用jquery的表格加载css
    'bower_components/datatables/media/css/jquery.dataTables.min.css',
    'lh_public/angular-datatables.css',

    'bower_components/ng-notify/dist/ng-notify.min.css', //信息提示

    //表格的css
    'lh_js_diy/angular-object-table/build/object-table-style.css',

    //树treeGrid
    'lh_js_diy/tree-grid-directive4019/src/treeGrid.css',


    //angular-ui-switch
    'bower_components/angular-ui-switch/angular-ui-switch.min.css',




    //带加载状态的按钮
    'bower_components/ng-bs-animated-button/ng-bs-animated-button.css',

    //ganttt 图用到的
    'bower_components/angular-gantt/dist/angular-gantt.css',
    'bower_components/angular-gantt/dist/angular-gantt-plugins.css',

    //弹出层 提示框 加载状态 提示信息
    'lh_js_diy/layer/pc/skin/layer.css',

    'app/css/css.css' // 我自己写的css

];


var htmlTempArr = ['app/template/*.html'];
var htmlArr = ['app/html/**/*.html'];
var imgArr = ['app/images/*'];


//输出到 svn images/angualrjs/lh_file目录
var mainPath = '../lh_file';


// 合并、压缩js文件 公用js压缩合并
gulp.task('js', function () {


    gulp.src(jsArr)

        .pipe(concat('main.js'))
        .pipe(gulp.dest(mainPath + "/js"))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(mainPath + "/js"))
        .pipe(notify({message: 'js hebing ok'}))
        .pipe(connect.reload());

});

//js本地页面编译,只对应当前页面的js
gulp.task('jsbendi', function () {

    gulp.src(jsArrBendi)


        .pipe(notify({message: 'js bendi ok'}))
        .pipe(connect.reload());


});


// 合并、压缩、重命名css
gulp.task('css', function () {
    return gulp.src(cssArr)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(mainPath + "/css"))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(mainPath + "/css"))
        .pipe(notify({message: 'css 压缩成功'}))
        .pipe(connect.reload());
});

// img
gulp.task('img', function () {
    gulp.src(imgArr)
        .pipe(gulp.dest(mainPath + "/images"))
        .pipe(notify({message: 'img shuchu ok'}))
        .pipe(connect.reload());

});


gulp.task('html-temp', function () {
    gulp.src(htmlTempArr)
        .pipe(concat('zujian.ftl'))
        .pipe(gulp.dest(mainPath + '/template'))
        .pipe(notify({message: 'html-temp ok'}))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src(htmlArr)
        //.pipe(gulp.dest('app/html'))
        .pipe(notify({message: 'html ok'}))
        .pipe(connect.reload());
});


//静态服务器
gulp.task('connect', function () {
    connect.server({
        root: '../',
        port: 9090,
        livereload: true,
        middleware: function (connect, opt) {
            var Proxy = require('gulp-connect-proxy');//服务器端口扩展
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});


gulp.task('watch', ['js', 'jsbendi', 'html-temp', 'img', 'html', 'css'], function () {

    gulp.watch(jsArr, ['js']);


    gulp.watch(htmlTempArr, ['html-ftl']);
    gulp.watch(htmlArr, ['html']);
    gulp.watch(cssArr, ['css']);

    gulp.watch(imgArr, ['img']);


});


gulp.task('watchBendi', ['jsbendi', 'html-temp', 'img', 'html', 'css'], function () {


    gulp.watch(jsArrBendi, ['jsbendi']);

    gulp.watch(htmlTempArr, ['html-ftl']);
    gulp.watch(htmlArr, ['html']);
    gulp.watch(cssArr, ['css']);

    gulp.watch(imgArr, ['img']);


});


gulp.task('合并', ['js', 'css']); //合并js css
gulp.task('default', ['watchBendi', 'connect']);
