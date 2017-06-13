
// 登陆页面js
GJ.logInit=function(){
	var form_user={};
    //回车键 登陆
    document.onkeydown = function(e){
        if(e.keyCode==13){
           login();
        }
    };
    // 点击按钮保存
    $('.log-btn').on('click',function(e){
        login();
    	
    });
    function login(){
        form_user.account = $('input[name="account"]').val();
        form_user.password = $('input[name="password"]').val();
        if($("#logForm").valid()){
            $.ajax({
                url: GJ.URL+"/user/login",
                type:"post",
                contentType:'application/json',
                dataType : "json",
                data:JSON.stringify(form_user),
                success: function(msg){
                    if(msg.resultCode==0){
                      GJ.user.account =msg.resultData.account;
                      GJ.user.companyGrade =msg.resultData.companyGrade;
                      GJ.user.companyId =msg.resultData.companyId;
                      GJ.user.id =msg.resultData.id;
                      GJ.user.nickName =msg.resultData.nickName;
                      GJ.user.phone =msg.resultData.phone;
                      GJ.user.token =msg.resultData.token;
                      GJ.user.userType =msg.resultData.userType;
                      GJ.user_info_storage(GJ.user);
                      location.replace('basic_setting.html');
                    }else if(msg.resultCode =="SYS-0015"){
                        $('.user-error').text('该用户不存在');
                    }else if(msg.resultCode =="SYS-0016"){
                        $('.user-error').text('帐号和密码不匹配');
                    }
                },
                error:function(msg){
                    console.log(msg);
                }
                
            });
        }
    }
	// 验证表单
    $('#logForm').validate({
			rules:{
				account: {
					required:true,
				},
				password: {
					required:true,
				}
			 },
		   messages :{
		   		account: {
					required:'*不能为空',
				},
				password: {
					required:'*不能为空',
				}
		   }
	})
}
// 基础设置中页面js
GJ.basicInit = function (){
    var user = JSON.parse(Cookies.get("user"));
	var args={
		creditMode:'',
		sealSecond:'',
		canDeleted:'',
		reportDay:'',
		userId:user.id,
		lotteryType:'0'
	}
	 // 请求查询
	function gainSet(){
		$.ajax({
		 	url: GJ.URL+"/sys/baseDataInfo",
		 	type:"post",
		 	contentType:'application/json',
		    dataType : "json",
		    data:JSON.stringify({lotteryType :args.lotteryType,userId :args.userId}),
		    beforeSend:function(){
		    	layer.load(3);
		    },
		    success: ApplyPage,
		    complete:function(){
	 			layer.closeAll('loading');
		    }
		});
	}
	 // 页面加载需要赋值
	 gainSet();

	 // 后台获得值渲染页面
	 function ApplyPage(msg){
	 	console.log(msg);
	 	args.creditMode = msg.resultData.creditMode;
	 	args.sealSecond =msg.resultData.sealSecond;
	 	args.canDeleted =msg.resultData.canDeleted;
	 	args.reportDay  =msg.resultData.reportDay;
	 	seleRadio($("input[name='mold'][data-nub='"+args.creditMode+"']").next());
	 	$("input[name='sealSecond']").val(args.sealSecond);
 		seleRadio($("input[name='allow'][data-nub='"+args.canDeleted+"']").next());
	 	$("input[name='reportDay']").val(args.reportDay);

	 }

		// 点击label选定radio
		$('label').click(function(){
	    	seleRadio($(this))
	    });

        // 设置input radio默认样式 参数是lable对象
	    function seleRadio($object){
	    	if ($object.hasClass('checked')) {

	    	}else{
	    		if($object.siblings('label').hasClass("checked")){
	    		   $object.siblings('label').removeClass('checked');
	    		   $object.siblings('label').prev('input').prop('checked',false);
	    		}

	    		$object.addClass('checked')
	    		$object.prev('input').prop('checked',true);
	    	}

	    }

	    $('.topbar-sort span').click(function(){
	    	args.lotteryType=$(this).data('nub');
	    	gainSet();
        	$(this).addClass('active').siblings().removeClass('active');
        })
        

        // 验证表单
        $('#baiseForm').validate({
				rules:{
					sealSecond: {
						required:true,
						digits:true,
						max:300
					},
					reportDay: {
						required:true,
						digits:true,
						max:30
					}
				 },
			   messages :{
			   		sealSecond: {
						required:'*不能为空',
						digits:'*必须是整数',
						max:'*最大为300秒'
					},
					reportDay: {
						required:'*不能为空',
						digits:'*必须是整数',
						max:'*最大为30天'
					}
			   }
		})
          // 点击按钮保存
	    $('.base-box').click(function(){
	    	if($("#baiseForm").valid()){
		    	args.creditMode  = $("input[name='mold']:checked").data('nub');
		    	args.sealSecond = $("input[name='sealSecond']").val();
		    	args.canDeleted = $("input[name='allow']:checked").data('nub');
		    	args.reportDay  = $("input[name='reportDay']").val();
				$.ajax({
				 	url: GJ.URL+"/sys/baseDataSet",
				 	type:"post",
				 	contentType:'application/json',
				    dataType : "json",
				    data:JSON.stringify(args),
				    beforeSend:function(xhr){
                        console.log(user.token);
                        xhr.setRequestHeader("authorization",user.token);
				    	layer.load(3);
				    },
				    success: function(msg){
				    	layer.open({
							type: 1,
							title: false,
							closeBtn: 0,
							shadeClose: true,
							skin: 'succ-box',
							content: '保存成功'
						})
					},
					complete: function(){
			 			layer.closeAll('loading');
				    }
			    });
			}
	    	
	    })
    }


// 公告设置
GJ.noticeInit =function(){
    var page=1;
    var pageSize = 8;
    var lotteryType = 0;

    var user =JSON.parse(Cookies.get("user"));
    var notice={
        title:'',
        content:'',
        lotteryType:'0',
        levelStr:'',
        type :'',
        ifpopup:'',
        addUserId: user.id
    };
    Pagination(page);

      function  Pagination(pageNo){
       $.ajax({
            url: GJ.URL+"/sys/noticeList",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({lotteryType:lotteryType,pageNo:page,pageSize:pageSize}),
            beforeSend:function(){
                layer.load(3);
            },
            success: callback,
            complete:function(){
                layer.closeAll('loading');
            }
        });
    }
    function callback(e){
        $('.all-nub em').text(e.totalPage);
        $('#page-nub input').val(page);
        var html = template('tpl-notice',e);
        $('#notice-tbody').empty().prepend(html) ;
    }
     $('.topbar-sort span').click(function(){
        lotteryType = $(this).data('nub');
        Pagination(1);
        $(this).addClass('active').siblings().removeClass('active');
    })



   /* 分页 输入*/
    document.onkeydown = function(e){
        if(e.keyCode==13){
            page = $('.sele-page input').val();
            if (page =='') {
                page=1;
            }
            Pagination(page);
            return false
        }
    };
    /*最后，第一个 分页*/
    $('.icon_arrows_frist').click(function(){
        page =1;
        Pagination(page);
    });
     $('.icon_arrows_last').click(function(){
        page = $('.all-nub em').text();
        Pagination(page);
    })

    /* 上一页，下一页*/
    $('.icon_arrows_left').click(function(){
        page =$('.sele-page input').val();
        if (page >1) {
            page = page-1;
        }
        Pagination(page);
    });
    $('.icon_arrows_right').click(function(){
         page = parseInt($('.sele-page input').val());
        if (page < parseInt($('.all-nub em').text())) {
            page = page+1;
        }
        Pagination(page);
    });

    /*增加公告*/
    $('.add-notice-btn').click(function(){
        console.log(lotteryType);
          $('.pulic-pop-add .layui-unselect').val($('.pulic-pop-add dd[lay-value='+lotteryType+']').text());
        $('.pulic-pop-add dd[lay-value='+lotteryType+']').addClass('layui-this').siblings().removeClass('layui-this');
        $('.pulic-pop-add').show();

    });
    $('.pulic-pop-add .icon-close').click(function(){
        $('.pulic-pop').hide();
    })

    $('.pulic-pop-add .add-notice-sub').click(function(){
        getFormNotice();  //获得表单里的notice
        console.log(notice);
        $.ajax({
            url: GJ.URL+"/sys/noticeAdd",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify(notice),
            beforeSend:function(xhr){
                xhr.setRequestHeader("authorization",user.token);
                layer.load(3);
            },
            success: function(e){
                $('.pulic-pop').hide();
                  Pagination(1);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
    })




    /*更改公告*/
     $('.pulic-pop-alter .icon-close').click(function(){
        $('.pulic-pop-alter .icon_checkbox').removeClass('icon_checkbox').addClass('icon_checkbox_no');
        $('.pulic-pop-alter .icon_radio').removeClass('icon_radio').addClass('icon_radio_no');
        $('.pulic-pop').hide();
    })
    $('.pulic-pop-alter .add-notice-sub').click(function(){
        getFormNoticeAlter();  //获得表单里的notice
        console.log(notice);
        $.ajax({
            url: GJ.URL+"/sys/noticeModify",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify(notice),
            beforeSend:function(xhr){
                 xhr.setRequestHeader("authorization",user.token);
                layer.load(3);
            },
            success: function(e){
                $('.pulic-pop-alter .icon_checkbox').removeClass('icon_checkbox').addClass('icon_checkbox_no');
                $('.pulic-pop-alter .icon_radio').removeClass('icon_radio').addClass('icon_radio_no');
                $('.pulic-pop').hide();
                  Pagination(page);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
    })



    $(document).on('click','.alter-btn',function(){
        notice.id = $(this).data('id');
         $.ajax({
            url: GJ.URL+"/sys/noticeInfo",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({id:notice.id}),
            beforeSend:function(){
                layer.load(3);
            },
            success: function(e){
               setFormNotice(e.resultData);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
         $('.pulic-pop-alter').show();
    })
    
     /*  删除公告*/
    $(document).on('click','.del-btn',function(){
        var id = $(this).data('id');
        console.log(id);
        //询问框
        var index = layer.confirm('确定要删除该公告吗？', {
            closeBtn: 0,
            btn: ['确定','取消']
        }, function(){
             $.ajax({
                url: GJ.URL+"/sys/noticeDel",
                type:"post",
                contentType:'application/json',
                dataType : "json",
                data:JSON.stringify({id:id}),
                beforeSend:function(xhr){
                    xhr.setRequestHeader("authorization",user.token);
                    layer.load(3);
                },
                success: function(e){
                    Pagination(page);
                    layer.msg('删除成功！', {icon: 1});
                },
                complete:function(){
                    layer.closeAll('loading');
                }
            });
           
        }, function(){
         
        });
    })
     function getNotice(){

     }
    //获得表单里的notice
    function getFormNotice(){
        var levelStreArray=[];
        notice.title = $('.pulic-pop-add input[name="title"]').val();
        notice.content = $('.pulic-pop-add textarea[name="content"]').val();
        notice.lotteryType = $('.pulic-pop-add .layui-this').attr('lay-value');
        notice.type =0;
        notice.ifpopup = $('.pulic-pop-add .ifpopup-radio .icon_radio').data('nub')
        $('.pulic-pop-add .levelstr-list .icon_checkbox').each(function(index,em){
           levelStreArray.push($(em).data('nub'));
        })
        if (levelStreArray.length !=5) {
            console.log(levelStreArray.length);
            notice.type = 1;
        }
         notice.levelStr =levelStreArray.join(',');
    }
     //获得表单里的notice
    function getFormNoticeAlter(){
        var levelStreArray=[];
        notice.title = $('.pulic-pop-alter input[name="title"]').val();
        notice.content = $('.pulic-pop-alter textarea[name="content"]').val();
        notice.lotteryType = $('.pulic-pop-alter .layui-this').attr('lay-value');
        notice.type =0;
        notice.ifpopup = $('.pulic-pop-alter .ifpopup-radio .icon_radio').data('nub')
        $('.pulic-pop-alter .levelstr-list .icon_checkbox').each(function(index,em){
           levelStreArray.push($(em).data('nub'));
        })
        if (levelStreArray.length !=5) {
            console.log(levelStreArray.length);
            notice.type = 1;
        }
         notice.levelStr =levelStreArray.join(',');
    }
    /*修改给表单赋值*/
    function setFormNotice(notice){
        $('.pulic-pop-alter input[name="title"]').val(notice.title);
        $('.pulic-pop-alter textarea[name="content"]').val(notice.content);
        $('.pulic-pop-alter .layui-unselect').val( $('.pulic-pop-alter dd[lay-value='+notice.lotteryType+']').text());
        $('.pulic-pop-alter dd[lay-value='+notice.lotteryType+']').addClass('layui-this').siblings().removeClass('layui-this');

        /*公告对象*/
        if (notice.type == 0) {
            $('.all-rank').removeClass('icon_checkbox_no').addClass('icon_checkbox');
            $('.levelstr-list span i').removeClass('icon_checkbox_no').addClass('icon_checkbox');
        }else{
             notice.level =notice.level.split(",");
             console.log( notice.level.length);
             for (var i = notice.level.length - 1; i >= 0; i--) {
                    $('.levelstr-list').find('.item').eq(Number(notice.level[i]-1)).find('i').removeClass('icon_checkbox_no').addClass('icon_checkbox');
             }
        }
        /*是否弹框*/
        $('.ifpopup-radio i[data-nub="'+notice.ifpopup+'"]').removeClass('icon_radio_no').addClass('icon_radio');
    }
    /*查看公告*/

    $(document).on('click','.show-btn',function(){
        notice.id = $(this).data('id');
         $.ajax({
            url: GJ.URL+"/sys/noticeInfo",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({id:notice.id}),
            beforeSend:function(){
                layer.load(3);
            },
            success: function(e){
               setNoticeShow(e.resultData);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
        $('.pulic-pop-show').show();

    })
	$('.pulic-pop-show .icon-close').click(function(){
        $('.pulic-pop-show').hide();
    })
    function setNoticeShow(notice){
        $('.pulic-pop-show .title').text(notice.title);
        $('.pulic-pop-show .time').text(notice.createDate);
        $('.pulic-pop-show .content').text(notice.content);
    }
}
/*水位设置*/
GJ.WarterInit=function(){
    var lotteryType = "1";
    var user =JSON.parse(Cookies.get("user"));
    var id = JSON.parse(Cookies.get("user")).id;
    var Warter ={
        ruleCode:'',
        ruleName:'',
        aOdds:'',
        aWaterBreak:'',
        bDifferent:'',
        bWaterBreak:'',
        cDifferent:'',
        cWaterBreak:'',
        maxOdds:'',
    }
    WarterInitF();
    function WarterInitF(){
        $.ajax({
            url: GJ.URL+"/sys/waterLevelList",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({lotteryType:lotteryType}),
            beforeSend:function(){
                layer.load(3);
            },
            success: function(e){
               setWarterInit(e.resultData);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
    } 
    /*重置按钮*/
    $('.btn-reset').click(function(){
         WarterInitF();
    });
    /*赋值*/
    function setWarterInit(list){
        for (var i =0 ; i < 14; i++) {
            if (list[i]!= undefined) {
                $('tbody tr').eq(i+1).find('.aOdds').val(list[i].aOdds);
                $('tbody tr').eq(i+1).find('.aWaterBreak').val(list[i].aWaterBreak);
                $('tbody tr').eq(i+1).find('.bDifferent').val(list[i].bDifferent);
                $('tbody tr').eq(i+1).find('.bWaterBreak').val(list[i].bWaterBreak);
                $('tbody tr').eq(i+1).find('.cDifferent').val(list[i].cDifferent);
                $('tbody tr').eq(i+1).find('.cWaterBreak').val(list[i].cWaterBreak);
                $('tbody tr').eq(i+1).find('.maxOdds').val(list[i].maxOdds);
            }else{
                 $('tbody tr').eq(i+1).find('.aOdds').val(0);
                 console.log($('tbody tr').eq(2+1).find('.aWaterBreak').length);
                if($('tbody tr').eq(i+1).find('.aWaterBreak').length !=0){
                    console.log(i);
                    console.log($('tbody tr').eq(i+1).find('.aWaterBreak'));
                     $('tbody tr').eq(i+1).find('.aWaterBreak').val(0);
                }
                if($('tbody tr').eq(i+1).find('.bDifferent').length !=0){
                     $('tbody tr').eq(i+1).find('.bDifferent').val(0);
                }
                if($('tbody tr').eq(i+1).find('.bWaterBreak').length !=0){
                     $('tbody tr').eq(i+1).find('.bWaterBreak').val(0);
                }
                if($('tbody tr').eq(i+1).find('.cDifferent').length !=0){
                     $('tbody tr').eq(i+1).find('.cDifferent').val(0);
                }
                if($('tbody tr').eq(i+1).find('.cWaterBreak').length !=0){
                     $('tbody tr').eq(i+1).find('.cWaterBreak').val(0);
                }
                if($('tbody tr').eq(i+1).find('.maxOdds').length !=0){
                     $('tbody tr').eq(i+1).find('.maxOdds').val(0);
                }
            }
        }

    };
    $('.btn-save').click(function(){
        getWarterInit();
    })
    function getWarterInit(){
        var Warters=[];
         
        for (var i =0 ; i < 14; i++) {
            var Warter={};
                Warter.ruleCode=$('tbody tr').eq(i+1).find('td').eq(0).data('id');
                Warter.aOdds=  $('tbody tr').eq(i+1).find('.aOdds').val();
                if($('tbody tr').eq(i+1).find('.aWaterBreak').length !=0){
                    Warter.aWaterBreak=$('tbody tr').eq(i+1).find('.aWaterBreak').val();
                }else{
                    Warter.aWaterBreak="0";
                }
                if($('tbody tr').eq(i+1).find('.bDifferent').length !=0){
                     Warter.bDifferent=$('tbody tr').eq(i+1).find('.bDifferent').val();
                }else{
                     Warter.bDifferent="0";
                }
                if($('tbody tr').eq(i+1).find('.bWaterBreak').length !=0){
                    Warter.bWaterBreak=$('tbody tr').eq(i+1).find('.bWaterBreak').val();
                }else{
                    Warter.bWaterBreak="0";
                }
                if($('tbody tr').eq(i+1).find('.cDifferent').length !=0){
                    Warter.cDifferent= $('tbody tr').eq(i+1).find('.cDifferent').val();
                }else{
                    Warter.cDifferent="0";
                }
                if($('tbody tr').eq(i+1).find('.cWaterBreak').length !=0){
                     Warter.cWaterBreak=$('tbody tr').eq(i+1).find('.cWaterBreak').val();
                }else{
                     Warter.cWaterBreak="0";
                }
                if($('tbody tr').eq(i+1).find('.maxOdds').length !=0){
                     Warter.maxOdds=$('tbody tr').eq(i+1).find('.maxOdds').val();
                }else{
                    Warter.maxOdds="0";
                }
                Warters.push(Warter);
        }
        $.ajax({
            url: GJ.URL+"/sys/waterLevelSet",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({lotteryType:lotteryType,sets:Warters,userId:id}),
            beforeSend:function(xhr){
                xhr.setRequestHeader("authorization",user.token);
                layer.load(3);
            },
            success: function(e){
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    skin: 'succ-box',
                    content: '保存成功'
                })
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
    }
}

/*投注限制*/
GJ.BettingInit= function(){
    var lotteryType =1;
    var userId=JSON.parse(Cookies.get("user")).id;
    // 选择彩种
    // $('.topbar-sort span').click(function(){
    //     lotteryType=$(this).data('nub');
    //     $(this).addClass('active').siblings().removeClass('active');
    // })
    setBettingAjax();
    function setBettingAjax(){
        $.ajax({
            url: GJ.URL+"/sys/limitInfo",
            type:"post",
            contentType:'application/json',
            dataType : "json",
            data:JSON.stringify({lotteryType:lotteryType,userId:userId}),
            beforeSend:function(){
                layer.load(3);
            },
            success: function(e){
               console.log(e);
               // setBetting(list);
            },
            complete:function(){
                layer.closeAll('loading');
            }
        });
    }
    function setBetting(list){
        for (var i =0 ; i < list.length; i++) {
            if (list[i]!= undefined) {
                $('tbody tr').eq(i).find('td').eq(0).attr('data-id',list[i].ruleCode);
                $('tbody tr').eq(i).find('.hightest').val(list[i].hightest);
                $('tbody tr').eq(i).find('.lowest').val(list[i].lowest);
                $('tbody tr').eq(i).find('.perHightest').val(list[i].perHightest);
            }else{
                if($('tbody tr').eq(i).find('.aWaterBreak').length !=0){
                    console.log($('tbody tr').eq(i+1).find('.aWaterBreak'));
                     $('tbody tr').eq(i).find('.aWaterBreak').val(0);
                }
                if($('tbody tr').eq(i).find('.bDifferent').length !=0){
                     $('tbody tr').eq(i).find('.bDifferent').val(0);
                }
            }
        }

    };

}