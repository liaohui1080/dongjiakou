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
var pageUrl = {

    userAdminManage: {
        listUserLogin:{
            addUser:{url:"/userAdminManage/control/createUserLogin", info: "新增登录用户"},
            searchCompany:{url:"/userAdminManage/control/findCompany", info: "新增时搜索所属企业json串 "},
            userList:{url:"/userAdminManage/control/findUserLogin", info: "用户列表"},
            deleteUserLogin:{url:"/userAdminManage/control/deleteUserLogin", info: "删除表格数据"},
            serrchPerson:{url:"/userAdminManage/control/findPerson", info: "根据企业Id查询员工列表"},
            updateUserLogin:{url:"/userAdminManage/control/updateUserLogin", info: "更新登录用户信息"}
        },
        listSecurityGroup:{
            findSecurityGroup:{url:"/userAdminManage/control/findSecurityGroup", info: "权限列表"},
            addSecurityGroup:{url:"/userAdminManage/control/addSecurityGroup", info: "新建权限"},
            deleteSecurityGroup:{url:"/userAdminManage/control/deleteSecurityGroup", info: "新建权限"},
            updateSecurityGroup:{url:"/userAdminManage/control/updateSecurityGroup", info: "新建权限"}
        },
		
        listCompany:{
        	companyList:{url:"/userAdminManage/control/findCompany", info: "企业列表"},
            createCompany:{url:"/userAdminManage/control/createCompany", info: "新增企业"},
            updateCompany:{url:"/userAdminManage/control/updateCompany", info: "修改企业 "},
            deleteCompany:{url:"/userAdminManage/control/deleteCompany", info: "删除企业"}
        }
    },
    
    company: {
        listCompanyNatural:{
        	companyList:{url:"/company/control/findCompany", info: "企业列表"},
        	createCompany:{url:"/userAdminManage/control/createCompany", info: "新增企业"},
            updateCompany:{url:"/company/control/updateCompany", info: "修改企业 "},
            deleteCompany:{url:"/company/control/deleteCompany", info: "删除企业"},
            findCompany:{url:"/company/control/findCompany", info: "查看一家企业详细信息"}
        },
		
        listCompanyCAD:{
        	cadList:{url:"/company/control/findCompanyCAD", info: "平面位置图列表"},
            createCompanyCAD:{url:"/company/control/createCompanyCAD", info: "新增平面位置图"},
            updateCompanyCAD:{url:"/company/control/updateCompanyCAD", info: "修改平面位置图 "},
            deleteCompanyCAD:{url:"/company/control/deleteCompanyCAD", info: "删除平面位置图"}
        },
        listPartyMangeRegime:{
        	findPartyMangeRegime:{url:"/company/control/findPartyMangeRegime", info: "管理制度列表"},
        	uploadPartyMangeRegime:{url:"/company/control/uploadPartyMangeRegime", info: "新建管理制度"},
            deletePartyMangeRegime:{url:"/company/control/deletePartyMangeRegime", info: "删除管理制度"},
            downLoadPartyMangeRegime:{url:"/company/control/downLoadPartyMangeRegime", info: "下载管理制度"}
        },
        listTrainRecord:{ 
        	findTrainRecord:{url:"/company/control/findTrainRecord", info: "员工培训记录列表"},
            addTrainRecord:{url:"/company/control/addTrainRecord", info: "新建员工培训记录"},
            deleteTrainRecord:{url:"/company/control/deleteTrainRecord", info: "删除员工培训记录"},
            updateTrainRecord:{url:"/company/control/updateTrainRecord", info: "修改员工培训记录"}
        },
        
        healthReport:{
    		healthReportList:{url:'/company/control/healthReportList',info:'企业健康报告列表'},
    		healthReportAdd:{url:'/company/control/healthReportAdd',info:'上报企业健康报告'},
    		healthReportRemove:{url:'/company/control/healthReportRemove',info:'删除企业健康报告'},
    		healthReportEdit:{url:'/company/control/healthReportEdit',info:'编辑企业健康报告'}
        }
    },

    document: {
        listSend:{
        	sendList:{url:"/document/control/findSend", info: "发文列表"},
            createSend:{url:"/document/control/createSend", info: "新增发文"},
            updateSend:{url:"/document/control/updateSend", info: "修改发文 "},
            deleteSend:{url:"/document/control/deleteSend", info: "删除发文"},
            findCompany:{url:"/company/control/findCompany", info: "查看一家企业详细信息"}
        },
		
        listFile:{
        	fileList:{url:"/document/control/findFiled", info: "归档列表"},
            deleteFile:{url:"/document/control/deleteFiled", info: "删除归档"},
        },
        
        receivedDetail:{
        	receivedDetail:{url:"/document/control/documentFiled", info: "文件归档"},
        	receivedList:{url:"/document/control/receivedList", info: "收文列表"},
        },
        
    },
    
};