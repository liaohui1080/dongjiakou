/**
 * Created by liaohui1080 on 16/2/26.
 *
 *
 *


 模块名字: {
        页面名字:{
            操作名字:{url:"/userAdminManage/control/createUserLogin", info: "新增登录用户"},
            searchCompany:{url:"/userAdminManage/control/getJsonCompany", info: "新增时搜索所属企业json串"}
        }
    }

 */



//var serverPath='images/angularjs/';
var serverPath='../../';

var pageUrl = {

    userAdminManage: {
        listUserLogin:{
            addUser:{url:serverPath+"json_server/user_list_shanchu.json", info: "新增登录用户"},
            searchCompany:{url:serverPath+"json_server/qiye_list.json", info: "新增时搜索所属企业json串 "},
            userList:{url:serverPath+"json_server/user_list.json", info: "用户列表"},
            userList2:{url:serverPath+"json_server/user_list2.json", info: "用户列表"},
            userListShanchu:{url:serverPath+"json_server/user_list_shanchu.json", info: "删除表格数据"},
            objdata:{url:serverPath+"json_server/objtabledat.json", info: "用户列表"},
            userListBianji:{url:serverPath+"json_server/user_list_shanchu.json", info: "编辑表格数据"},
            tree:{url:serverPath+"json_server/tree_data/tree1.json", info: "编辑表格数据"}
        }
    }


};




