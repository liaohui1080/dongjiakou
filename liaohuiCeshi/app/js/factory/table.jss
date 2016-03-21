/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 服务创建页面
 */

var lhTable=(function(){


    var table=['DTOptionsBuilder',function(DTOptionsBuilder){


            var lhTable=this;


            lhTable.options=function(o){

                //设置默认显示条数
                if(o.shu){
                    var shu= o.shu;
                }else{
                    o.shu=10;
                }

                //设置默认显示文字
                if(o.withLanguage){
                    var withLanguage=o.withLanguage;
                }else{
                    var withLanguage={
                        "sEmptyTable": "No data available in table",
                        "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
                        "sInfoEmpty": "Showing 0 to 0 of 0 entries",
                        "sInfoFiltered": "(filtered from _MAX_ total entries)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ",",
                        "sLengthMenu": " _MENU_ 条",
                        "sLoadingRecords": "Loading...",
                        "sProcessing": "Processing...",
                        "sSearch": "搜索:",
                        "sZeroRecords": "No matching records found",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sLast": "尾页",
                            "sNext": "下一页",
                            "sPrevious": "上一页"
                        },
                        "oAria": {
                            "sSortAscending": ": activate to sort column ascending",
                            "sSortDescending": ": activate to sort column descending"
                        }
                    }
                }


                var dtOptions = DTOptionsBuilder.newOptions()
                    //.withDOM('frtip') //隐藏条数

                    .withBootstrapOptions({
                        TableTools: {
                            classes: {
                                container: 'btn-group',
                                buttons: {
                                    normal: 'btn btn-danger'
                                }
                            }
                        },
                        ColVis: {
                            classes: {
                                masterButton: 'btn btn-primary'
                            }
                        },
                        pagination: {
                            classes: {
                                ul: 'pagination pagination-sm'
                            }
                        }
                    })

                    //.withBootstrap()
                    .withDisplayLength(shu)
                    .withPaginationType('full_numbers')
                    .withLanguage(withLanguage);

                return dtOptions;
            };



            return lhTable;


        }];



    return {
        table:table,

    };

})();



